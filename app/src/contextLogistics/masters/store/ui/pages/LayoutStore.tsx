import { useEffect, useState } from 'react'
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
import { AddDialog, CustomToolbar } from '../components'
import { StoreENTITY } from 'logiflowerp-sdk'

export default function LayoutStore() {

	const [rows, setRows] = useState<readonly StoreENTITY[]>([])
	const [open, setOpen] = useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetStoresQuery()
	const [updateStore, { isLoading: isLoadingUpdate }] = useUpdateStoreMutation()
	const [deleteStore, { isLoading: isLoadingDelete }] = useDeleteStoreMutation()
	useEffect(() => data && setRows(data), [data])

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
				<DataGrid<StoreENTITY>
					rows={rows}
					columns={columns()}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar handleClickAdd={handleClick} /> }}
					getRowId={row => row._id}
				/>
			</Box>
			<AddDialog
				open={open}
				setOpen={setOpen}
			/>
		</>
	)
}
