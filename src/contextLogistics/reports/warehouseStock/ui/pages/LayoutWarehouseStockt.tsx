import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useUpdateIWarehouseStockMutation,
	useGetIWarehouseStocksQuery,
} from '@shared/api'
import { CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'
// import { CustomToolbar } from '../components'
import { IWarehouseStockENTITY } from 'logiflowerp-sdk'

export default function LayoutWarehouseStock() {

	const [rows, setRows] = useState<readonly IWarehouseStockENTITY[]>([])
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<IWarehouseStockENTITY>()

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetIWarehouseStocksQuery()
	const [updateIStore, { isLoading: isLoadingUpdate }] = useUpdateIWarehouseStockMutation()
	useEffect(() => data && setRows(data), [data])


	const handleEditClick = (row: IWarehouseStockENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
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
				<DataGrid<IWarehouseStockENTITY>
					rows={rows}
					columns={columns({ handleEditClick })}
					disableRowSelectionOnClick
					getRowId={row => row._id}
				/>
			</Box>

		</>
	)
}
