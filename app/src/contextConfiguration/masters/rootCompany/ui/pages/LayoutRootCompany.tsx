import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useGetRootCompaniesQuery,
	useUpdateRootCompanyMutation,
} from '@shared/api'
import { RootCompanyENTITY, State, UpdateRootCompanyDTO } from 'logiflowerp-sdk'
import { CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))

export default function LayoutRootCompany() {

	const [rows, setRows] = useState<readonly RootCompanyENTITY[]>([])
	const [open, setOpen] = useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetRootCompaniesQuery()
	const [updateRootCompany, { isLoading: isLoadingUpdate }] = useUpdateRootCompanyMutation()
	useEffect(() => data && setRows(data), [data])

	const handleClick = () => {
		try {
			setOpen(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleChangeStatusClick = async (row: RootCompanyENTITY) => {
		try {
			const dto = new UpdateRootCompanyDTO()
			dto.set(row)
			dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
			await updateRootCompany({ id: row._id, data: dto }).unwrap()
			enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (isLoading || isLoadingUpdate) return <CustomViewLoading />
	if (error) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid<RootCompanyENTITY>
					rows={rows}
					columns={columns({ handleChangeStatusClick })}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar handleClickAdd={handleClick} /> }}
					getRowId={row => row._id}
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
