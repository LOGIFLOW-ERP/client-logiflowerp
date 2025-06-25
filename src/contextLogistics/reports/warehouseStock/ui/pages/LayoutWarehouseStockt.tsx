import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useUpdateWarehouseStockMutation,
	useReportWarehouseStockQuery,
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { WarehouseStockENTITYFlat } from 'logiflowerp-sdk'
import { getcolumns } from '../GridCol/columns'

export default function LayoutWarehouseStock() {

	const [rows] = useState<WarehouseStockENTITYFlat[]>([])
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<WarehouseStockENTITYFlat>()

	const { enqueueSnackbar } = useSnackbar()
	// const [fetchReport, { data, isLoading, isError }] = useLazyReportWarehouseStockQuery()
	const pipeline = [{ $match: {} }]
	const { data, isLoading, isError } = useReportWarehouseStockQuery(pipeline)
	const [updateIStore, { isLoading: isLoadingUpdate }] = useUpdateWarehouseStockMutation()

	const handleEditClick = (row: WarehouseStockENTITYFlat) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (isError) return <CustomViewError />

	return (
		<Box sx={{ height: 400, width: '100%' }}>
			<DataGrid<WarehouseStockENTITYFlat>
				rows={data}
				columns={getcolumns({ handleEditClick })}
				disableRowSelectionOnClick
				getRowId={row => row._id}
				loading={isLoading || isLoadingUpdate}
			/>
		</Box>
	)
}
