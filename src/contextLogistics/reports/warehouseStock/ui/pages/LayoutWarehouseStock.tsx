import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useReportWarehouseStockQuery
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { WarehouseStockENTITYFlat } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { Paper, Typography } from '@mui/material'
import { Fallback } from '@app/ui/pages'
import { useExportExcelWarehouseStock } from '../hooks/useExportExcel'

const WarehouseStockSerialDialog = lazy(() => import('../components/WarehouseStockSerialDialog').then(m => ({ default: m.WarehouseStockSerialDialog })))

export default function LayoutWarehouseStock() {
	const [openWarehouseStockSerialDialog, setOpenWarehouseStockSerialDialog] = useState(false)

	const [_selectedRow, setSelectedRow] = useState<WarehouseStockENTITYFlat>()

	const apiRef = useGridApiRef()

	const { enqueueSnackbar } = useSnackbar()
	const pipeline = [{ $match: {} }]
	const { data, isLoading, isError } = useReportWarehouseStockQuery(pipeline)
	const { exportExcelWarehouseStock, isLoadingExportExcel, isErrorExportExcel, errorExportExcel } = useExportExcelWarehouseStock()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [
		data,
		openWarehouseStockSerialDialog,
		isLoading,
		isLoadingExportExcel
	])

	const handleScannClick = (row: WarehouseStockENTITYFlat) => {
		try {
			setSelectedRow(row)
			setOpenWarehouseStockSerialDialog(true)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleExportExcelClick = async () => {
		try {
			await exportExcelWarehouseStock(apiRef, data || [])
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	if (isError || isErrorExportExcel) return <CustomViewError error={errorExportExcel} />

	return (
		<>
			<Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
				<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
					<Typography variant='h6'>Stock Almacen</Typography>
				</Box>
				<Box sx={{ height: '94%' }}>
					<DataGrid<WarehouseStockENTITYFlat>
						rows={data}
						columns={columns({ handleScannClick })}
						disableRowSelectionOnClick
						showToolbar
						getRowId={row => row._id}
						loading={isLoading || isLoadingExportExcel}
						autoPageSize
						density='compact'
						apiRef={apiRef}
						slots={{
							toolbar: () => (
								<CustomToolbar
									AGREGAR_NUEVO_REGISTRO={false}
									handleExportExcelClick={handleExportExcelClick}
									btnSerialTracking
								/>
							)
						}}
					/>
				</Box>
			</Paper>

			<Suspense fallback={<Fallback />}>
				{
					(_selectedRow && openWarehouseStockSerialDialog) && (
						<WarehouseStockSerialDialog
							open={openWarehouseStockSerialDialog}
							setOpen={setOpenWarehouseStockSerialDialog}
							selectedRow={_selectedRow}
						/>
					)
				}
			</Suspense>

		</>

	)
}
