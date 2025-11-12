import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'
import {
	useDeleteWarehouseEntryMutation,
	useGetWarehouseEntryPipelineQuery,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { WarehouseEntryENTITY, StateOrder } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { Box, Typography } from '@mui/material'
import { useExportExcel, usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
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
	const pipeline = [{ $match: { state: StateOrder.REGISTRADO } }]
	const { data, error, isLoading } = useGetWarehouseEntryPipelineQuery(pipeline)
	const [deleteWarehouseEntry, { isLoading: isLoadingDelete }] = useDeleteWarehouseEntryMutation()

	const apiRef = useGridApiRef()
	const { exportExcel } = useExportExcel()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
		if (selectedDocument) {
			const exist = data?.find(d => d._id === selectedDocument._id)
			setState({ selectedDocument: exist ? exist : null })
			if (selectedDetail) {
				const exist = selectedDocument.detail?.find(d => d.keyDetail === selectedDetail.keyDetail && d.keySearch === selectedDetail.keySearch)
				setState({ selectedDetail: exist ? exist : null })
			}
		}
	}, [data, openAdd])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
			setState({ selectedDocument: null })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleEditClick = (row: WarehouseEntryENTITY) => {
		try {
			setState({ selectedDocument: row })
			setOpenAdd(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: WarehouseEntryENTITY) => {
		try {
			await deleteWarehouseEntry(row._id).unwrap()
			enqueueSnackbar({ message: '¡Documento eliminado!', variant: 'success' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const _columns = columns({ handleEditClick, handleDeleteClick, canDeleteWarehouseEntryByID })

	const handleExportExcelClick = () => {
		if (!apiRef.current) return
		const csv = apiRef.current.getDataAsCsv()
		exportExcel(csv, 'Ingreso_Almacen')
	}

	if (error) return <CustomViewError />

	return (
		<>
			<Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6">Documentos de Ingreso No Validados</Typography>
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
						loading={isLoading || isLoadingDelete}
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
						/>
					)
				}
			</Suspense>
		</>
	)
}
