import { useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
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

	const [_openEdit, setOpenEdit] = useState(false)
	const [_selectedRow, setSelectedRow] = useState<WarehouseStockENTITYFlat>()
	const apiRef = useGridApiRef()

	const { enqueueSnackbar } = useSnackbar()
	const pipeline = [{ $match: {} }]
	const { data, isLoading, isError } = useReportWarehouseStockQuery(pipeline)
	const [_updateIStore, { isLoading: isLoadingUpdate }] = useUpdateWarehouseStockMutation()
	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data])

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
				columns={getcolumns({
					handleEditClick,
					rows: data ?? [],
					fieldsToInclude: [
						'stockType',
						'store_company_code',
						'store_code',
						"item_itemCode",
						"item_itemName",
						"item_uomCode",
						"incomeAmount",
						"amountReturned",
						"ouputQuantity",
						"stock",
						'lot'
					], // solo estos campos
					renameMap: {
						stockType: 'Tipo',
						store_company_code: 'Empresa',
						store_code: 'Almacen',
						item_itemCode: 'Código',
						item_itemName: 'Nombre',
						item_uomCode: 'UM',
						incomeAmount: 'Ingreso',
						amountReturned: 'Devolucion',
						ouputQuantity: 'Despacho',
						lot: 'Lote'
					}
				})}
				disableRowSelectionOnClick
				getRowId={row => row._id}
				density='compact'
				// apiRef={apiRef}
				loading={isLoading || isLoadingUpdate}
				showToolbar
			/>
		</Box>
	)
}
