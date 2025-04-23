import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useDeleteStoreMutation,
	useGetStoresQuery,
	useUpdateStoreMutation,
} from '@shared/api'
import { CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
import { StoreENTITY } from 'logiflowerp-sdk'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))

export default function LayoutStore() {

	const [rows, setRows] = useState<readonly StoreENTITY[]>([])
	const [openAdd, setOpenAdd] = useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetStoresQuery()
	const [updateStore, { isLoading: isLoadingUpdate }] = useUpdateStoreMutation()
	const [deleteStore, { isLoading: isLoadingDelete }] = useDeleteStoreMutation()
	useEffect(() => data && setRows(data), [data])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
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
				<DataGrid<StoreENTITY>
					rows={rows}
					columns={columns()}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} /> }}
					getRowId={row => row._id}
				/>
			</Box>
			{
				openAdd && (
					<AddDialog
						open={openAdd}
						setOpen={setOpenAdd}
					/>
				)
			}
		</>
	)
}
