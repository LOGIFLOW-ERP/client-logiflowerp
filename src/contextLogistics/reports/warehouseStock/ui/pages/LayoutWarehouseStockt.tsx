import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useUpdateWarehouseStockMutation,
	useLazyReportWarehouseStockQuery,
} from '@shared/api'
import { CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'
// import { CustomToolbar } from '../components'
import { IWarehouseStockENTITY, WarehouseStockENTITY } from 'logiflowerp-sdk'
import { _columns } from '../GridCol/_columns'

export default function LayoutWarehouseStock() {

	const [rows, setRows] = useState<readonly WarehouseStockENTITY[]>([])
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<WarehouseStockENTITY>()

	const { enqueueSnackbar } = useSnackbar()
	const [reportWarehouseStockQuery, { isLoading, isError }] = useLazyReportWarehouseStockQuery()
	const [updateIStore, { isLoading: isLoadingUpdate }] = useUpdateWarehouseStockMutation()


	const handleEditClick = (row: WarehouseStockENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (isLoading || isLoadingUpdate) return <CustomViewLoading />
	if (isError) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid<WarehouseStockENTITY>
					rows={rows}
					columns={_columns}
					disableRowSelectionOnClick
					getRowId={row => row._id}
				/>
			</Box>

		</>
	)
}
