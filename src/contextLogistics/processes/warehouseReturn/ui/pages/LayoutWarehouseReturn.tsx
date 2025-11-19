import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'
import {
	useDeleteWarehouseReturnMutation,
	useGetWarehouseReturnPipelineQuery,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { WarehouseReturnENTITY, StateOrder } from 'logiflowerp-sdk'
import { columns } from '../GridCol'
import { Box, Typography } from '@mui/material'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))

export default function LayoutWarehouseReturn() {

	const [openAdd, setOpenAdd] = useState(false)
	const { setState } = useStore('warehouseReturn')

	const [
		POST_WAREHOUSE_RETURN,
		canDeleteWarehouseReturnByID
	] = usePermissions([
		PERMISSIONS.POST_WAREHOUSE_RETURN,
		PERMISSIONS.DELETE_WAREHOUSE_RETURN_BY_ID,
	])
	const { enqueueSnackbar } = useSnackbar()
	const pipeline = [{ $match: { state: StateOrder.REGISTRADO } }]
	const { data, error, isLoading } = useGetWarehouseReturnPipelineQuery(pipeline)
	const [deleteWarehouseReturn, { isLoading: isLoadingDelete }] = useDeleteWarehouseReturnMutation()

	const apiRef = useGridApiRef()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, openAdd])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
			setState({ selectedDocument: null })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleEditClick = (row: WarehouseReturnENTITY) => {
		try {
			setState({ selectedDocument: row })
			setOpenAdd(true)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: WarehouseReturnENTITY) => {
		try {
			await deleteWarehouseReturn(row._id).unwrap()
			enqueueSnackbar({ message: '¡Documento eliminado!', variant: 'success' })
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
					<Typography variant="h6">Documentos de Devolución No Validados</Typography>
				</Box>
				<Box sx={{ height: '94%' }}>
					<DataGrid<WarehouseReturnENTITY>
						rows={data}
						columns={columns({ handleEditClick, handleDeleteClick, canDeleteWarehouseReturnByID })}
						disableRowSelectionOnClick
						slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} AGREGAR_NUEVO_REGISTRO={POST_WAREHOUSE_RETURN} /> }}
						showToolbar
						density='compact'
						apiRef={apiRef}
						getRowId={row => row._id}
						loading={isLoading || isLoadingDelete}
						autoPageSize
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
