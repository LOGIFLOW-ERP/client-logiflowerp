import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useUpdateWarehouseStockMutation,
	useLazyReportWarehouseStockQuery,
} from '@shared/api'
import { CustomViewError, CustomViewLoading } from '@shared/ui-library'
// import { CustomToolbar } from '../components'
import { StateOrder, WarehouseStockENTITYFlat } from 'logiflowerp-sdk'
import { getcolumns } from '../GridCol/_columns'

export default function LayoutWarehouseStock() {

	const [rows] = useState<WarehouseStockENTITYFlat[]>([])
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<WarehouseStockENTITYFlat>()

	const { enqueueSnackbar } = useSnackbar()
	const [data, isError, isLoading] = useLazyReportWarehouseStockQuery()
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

	if (isLoading || isLoadingUpdate) return <CustomViewLoading />
	if (isError) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid<WarehouseStockENTITYFlat>
					rows={data}
					columns={getcolumns({ handleEditClick })}
					disableRowSelectionOnClick
					getRowId={row => row._id}
				/>
			</Box>

		</>
	)
}
