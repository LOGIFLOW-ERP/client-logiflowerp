import { lazy, useEffect, useState } from 'react'
import {
	DataGrid,
	GridValidRowModel,
} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useDeleteRootCompanyMutation,
	useGetRootCompaniesQuery,
	useUpdateRootCompanyMutation,
} from '@shared/api'
import { CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))

export default function LayoutRootCompany() {

	const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
	const [open, setOpen] = useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetRootCompaniesQuery()
	const [updateRootCompany, { isLoading: isLoadingUpdate }] = useUpdateRootCompanyMutation()
	const [deleteRootCompany, { isLoading: isLoadingDelete }] = useDeleteRootCompanyMutation()
	useEffect(() => data && setRows(data.map(e => ({ ...e, id: e._id }))), [data])

	const handleClick = () => {
		try {
			setOpen(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (isLoading || isLoadingUpdate || isLoadingDelete) return <CustomViewLoading />
	if (error) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns()}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar handleClickAdd={handleClick} /> }}
				/>
			</Box>
			{
				open && (
					<AddDialog
						open={open}
						setOpen={setOpen}
					/>
				)
			}
		</>
	)
}
