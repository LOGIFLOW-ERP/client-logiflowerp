import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'
import {
	useDeleteWarehouseEntryMutation,
	useGetWarehouseEntryPipelineQuery,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { WarehouseEntryENTITY } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { Box, Typography } from '@mui/material'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
import { useIngresoAlmacenPDF } from '../hooks/useWarehouseExitPDF'
import { useExportExcelWarehouseEntry } from '../hooks/useExportExcel'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))

export default function LayoutWarehouseEntry() {

	const [openAdd, setOpenAdd] = useState(false)
	const { setState, state: { selectedDocument, selectedDetail } } = useStore('warehouseEntry')

	const [
		POST_WAREHOUSE_ENTRY,
		canDeleteWarehouseEntryByID
	] = usePermissions([
		PERMISSIONS.POST_WAREHOUSE_ENTRY,
		PERMISSIONS.DELETE_WAREHOUSE_ENTRY_BY_ID,
	])
	const { enqueueSnackbar } = useSnackbar()
	// const pipeline = [{ $match: { state: { $in: [StateOrder.REGISTRADO, StateOrder.PROCESANDO] } } }]
	const limit = 200
	const pipeline = [
		{ $limit: limit },
		{ $sort: { 'workflow.register.date': -1 } }
	]
	const { data, error, isFetching } = useGetWarehouseEntryPipelineQuery(pipeline)
	const [deleteWarehouseEntry, { isLoading: isLoadingDelete }] = useDeleteWarehouseEntryMutation()

	const apiRef = useGridApiRef()
	// const { exportExcel, getCsvString } = useExportExcel<WarehouseEntryENTITY>()
	const { exportExcelWarehouseEntry } = useExportExcelWarehouseEntry()
	const { generatePDF } = useIngresoAlmacenPDF()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
		if (selectedDocument) {
			const existDoc = data?.find(d => d._id === selectedDocument._id)
			if (existDoc) {
				setState({ selectedDocument: existDoc })
				if (selectedDetail) {
					const existDet = existDoc.detail?.find(d => d.keyDetail === selectedDetail.keyDetail && d.keySearch === selectedDetail.keySearch)
					if (existDet) {
						setState({ selectedDetail: existDet })
					}
				}
			}
		}
	}, [data, openAdd, isFetching, isLoadingDelete])

	useEffect(() => {
		if (data?.length) {
			enqueueSnackbar({ message: `Se han cargado los documentos más recientes (límite: ${limit}).`, variant: 'info' })
		}
	}, [data])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
			setState({ selectedDocument: null })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleEditClick = (row: WarehouseEntryENTITY) => {
		try {
			setState({ selectedDocument: row })
			setOpenAdd(true)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: WarehouseEntryENTITY) => {
		try {
			await deleteWarehouseEntry(row._id).unwrap()
			enqueueSnackbar({ message: '¡Documento eliminado!', variant: 'success' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleViewPdfClick = async (row: WarehouseEntryENTITY) => {
		try {
			await generatePDF(row)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const _columns = columns({ handleEditClick, handleDeleteClick, canDeleteWarehouseEntryByID, handleViewPdfClick })

	const handleExportExcelClick = () => {
		try {
			exportExcelWarehouseEntry(apiRef, data ?? [])
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	if (error) return <CustomViewError />

	return (
		<>
			<Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6">Ingreso almacén</Typography>
				</Box>
				<Box sx={{ height: '94%' }}>
					<DataGrid<WarehouseEntryENTITY>
						rows={data}
						columns={_columns}
						disableRowSelectionOnClick
						slots={{
							toolbar: () => (
								<CustomToolbar
									handleAddClick={handleAddClick}
									AGREGAR_NUEVO_REGISTRO={POST_WAREHOUSE_ENTRY}
									handleExportExcelClick={handleExportExcelClick}
								/>
							)
						}}
						showToolbar
						getRowId={row => row._id}
						loading={isFetching || isLoadingDelete}
						autoPageSize
						apiRef={apiRef}
						density='compact'
					/>
				</Box>
			</Paper>
			<Suspense fallback={<Fallback />}>
				{
					openAdd && (
						<AddDialog
							open={openAdd}
							setOpen={setOpenAdd}
							isFetching={isFetching}
						/>
					)
				}
			</Suspense>
		</>
	)
}
