import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useReportWarehouseStockQuery
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { WarehouseStockENTITYFlat } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { Paper, Typography } from '@mui/material'
import { Fallback } from '@app/ui/pages'

const WarehouseStockSerialDialog = lazy(() => import('../components/WarehouseStockSerialDialog').then(m => ({ default: m.WarehouseStockSerialDialog })))


export default function LayoutWarehouseStock() {

	const [openAdd] = useState(false)

	const [openWarehouseStockSerialDialog, setOpenWarehouseStockSerialDialog] = useState(false)

	const [_selectedRow, setSelectedRow] = useState<WarehouseStockENTITYFlat>()

	const apiRef = useGridApiRef()

	const { enqueueSnackbar } = useSnackbar()
	const pipeline = [{ $match: {} }]
	const { data, isLoading, isError } = useReportWarehouseStockQuery(pipeline)


	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, openAdd])

	const handleScannClick = (row: WarehouseStockENTITYFlat) => {
		try {
			setSelectedRow(row)
			setOpenWarehouseStockSerialDialog(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (isError) return <CustomViewError />

	return (
		<>
			<Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6">Stock Almacen</Typography>
				</Box>
				<Box sx={{ height: '94%' }}>
					<DataGrid<WarehouseStockENTITYFlat>
						rows={data}
						columns={columns({ handleScannClick })}
						disableRowSelectionOnClick
						showToolbar
						getRowId={row => row._id}
						loading={isLoading}
						autoPageSize
						density='compact'
						apiRef={apiRef}
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
