import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'
import {
	useDeleteWarehouseExitMutation,
	useGetWarehouseExitPipelineQuery,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { WarehouseExitENTITY } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { Box, Typography } from '@mui/material'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
import { InputFileUploadBulkExit } from '../components/InputFileUploadBulkExit'
import { useSalidaAlmacenPDF } from '../hooks/useWarehouseExitPDF'
import { useExportExcelWarehouseExit } from '../hooks/useExportExcel'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))

export default function LayoutWarehouseExit() {

	const [openAdd, setOpenAdd] = useState(false)
	const { setState } = useStore('warehouseExit')

	const [
		POST_WAREHOUSE_EXIT,
		canDeleteWarehouseExitByID
	] = usePermissions([
		PERMISSIONS.POST_WAREHOUSE_EXIT,
		PERMISSIONS.DELETE_WAREHOUSE_EXIT_BY_ID,
	])
	const { enqueueSnackbar } = useSnackbar()
	const { exportExcelWarehouseExit } = useExportExcelWarehouseExit()
	const { generatePDF } = useSalidaAlmacenPDF()
	const limit = 200
	const pipeline = [
		{ $limit: limit },
		{ $sort: { 'workflow.register.date': -1 } }
	]
	const { data, error, isFetching, isError } = useGetWarehouseExitPipelineQuery(pipeline)
	const [deleteWarehouseExit, { isLoading: isLoadingDelete, isError: isErrorDelete, error: errorDelete }] = useDeleteWarehouseExitMutation()

	const apiRef = useGridApiRef()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, openAdd, isFetching, isLoadingDelete])

	useEffect(() => {
		enqueueSnackbar({ message: `Se muestran los documentos más recientes (límite: ${limit}).`, variant: 'info' })
	}, [])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
			setState({ selectedDocument: null })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleEditClick = (row: WarehouseExitENTITY) => {
		try {
			setState({ selectedDocument: row })
			setOpenAdd(true)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleViewPdfClick = async (row: WarehouseExitENTITY) => {
		try {
			await generatePDF(row)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: WarehouseExitENTITY) => {
		try {
			await deleteWarehouseExit(row._id).unwrap()
			enqueueSnackbar({ message: '¡Documento eliminado!', variant: 'success' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleExportExcelClick = () => {
		try {
			exportExcelWarehouseExit(apiRef, data ?? [])
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	if (isError || isErrorDelete) return <CustomViewError error={error || errorDelete} />

	return (
		<>
			<Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6">Salida almacén</Typography>
				</Box>
				<Box sx={{ height: '94%' }}>
					<DataGrid<WarehouseExitENTITY>
						rows={data}
						columns={columns({
							handleEditClick,
							handleDeleteClick,
							handleViewPdfClick, canDeleteWarehouseExitByID
						})}
						disableRowSelectionOnClick
						slots={{
							toolbar: () => (
								<CustomToolbar
									handleAddClick={handleAddClick}
									AGREGAR_NUEVO_REGISTRO={POST_WAREHOUSE_EXIT}
									customInputFileUpload1={<InputFileUploadBulkExit />}
									handleExportExcelClick={handleExportExcelClick}
								/>
							)
						}}
						showToolbar
						getRowId={row => row._id}
						loading={isFetching || isLoadingDelete}
						autoPageSize
						density='compact'
						apiRef={apiRef}
					/>
				</Box>
			</Paper>
			<Suspense fallback={<Fallback />}>
				{
					openAdd && (
						<AddDialog
							open={openAdd}
							setOpen={setOpenAdd}
						/>
					)
				}
			</Suspense>
		</>
	)
}
