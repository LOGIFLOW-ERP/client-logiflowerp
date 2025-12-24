import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'
import {
	useDeleteWarehouseReturnMutation,
	useGetWarehouseReturnPipelineIndividualQuery,
	useGetWarehouseReturnPipelineQuery,
	useRegisterWarehouseReturnMutation,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { WarehouseReturnENTITY, StateOrder } from 'logiflowerp-sdk'
import { columns } from '../GridCol'
import { Box, Typography } from '@mui/material'
import { usePermissions, useResetApiState, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))

export default function LayoutWarehouseReturn() {

	const [openAdd, setOpenAdd] = useState(false)
	const { setState } = useStore('warehouseReturn')

	const [
		POST_WAREHOUSE_RETURN,
		POST_WAREHOUSE_RETURN_CREATE_DRAFT_RECORD,
		POST_WAREHOUSE_RETURN_FIND,
	] = usePermissions([
		PERMISSIONS.POST_WAREHOUSE_RETURN,
		PERMISSIONS.POST_WAREHOUSE_RETURN_CREATE_DRAFT_RECORD,
		PERMISSIONS.POST_WAREHOUSE_RETURN_FIND,
	])
	const { enqueueSnackbar } = useSnackbar()
	const resetApiState = useResetApiState()
	const limit = 200
	const pipeline = POST_WAREHOUSE_RETURN
		? [
			{ $match: { state: { $ne: StateOrder.BORRADOR } } },
			{ $limit: limit },
			{ $sort: { 'workflow.register.date': -1 } }
		]
		: [{ $match: { state: StateOrder.BORRADOR } }]
	const { data, error, isFetching, isError } = POST_WAREHOUSE_RETURN_FIND
		? useGetWarehouseReturnPipelineQuery(pipeline)
		: useGetWarehouseReturnPipelineIndividualQuery(pipeline)
	const [
		deleteWarehouseReturn,
		{ isLoading: isLoadingDelete, isError: isErrorDelete, error: errorDelete }
	] = useDeleteWarehouseReturnMutation()
	const [
		registerWarehouseReturn,
		{ isLoading: isLoadingRegister, isError: isErrorRegister, error: errorRegister }
	] = useRegisterWarehouseReturnMutation()

	const apiRef = useGridApiRef()

	useEffect(() => {
		enqueueSnackbar({ message: `Se muestran los documentos más recientes (límite: ${limit}).`, variant: 'info' })
	}, [])

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [openAdd, isLoadingRegister, isLoadingDelete, isFetching])

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
			resetApiState(['employeeStockApi', 'warehouseStockApi'])
			enqueueSnackbar({ message: '¡Documento eliminado!', variant: 'success' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleRegisterClick = async (row: WarehouseReturnENTITY) => {
		try {
			await registerWarehouseReturn(row._id).unwrap()
			enqueueSnackbar({ message: '¡Documento registrado!', variant: 'success' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	if (isError || isErrorDelete || isErrorRegister) return <CustomViewError error={error || errorDelete || errorRegister} />

	return (
		<>
			<Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6">Devolución almacén</Typography>
				</Box>
				<Box sx={{ height: '94%' }}>
					<DataGrid<WarehouseReturnENTITY>
						rows={data}
						columns={columns({ handleEditClick, handleDeleteClick, handleRegisterClick })}
						disableRowSelectionOnClick
						slots={{
							toolbar: () => (
								<CustomToolbar
									handleAddClick={handleAddClick}
									AGREGAR_NUEVO_REGISTRO={POST_WAREHOUSE_RETURN || POST_WAREHOUSE_RETURN_CREATE_DRAFT_RECORD}
								/>
							)
						}}
						showToolbar
						density='compact'
						apiRef={apiRef}
						getRowId={row => row._id}
						loading={isFetching || isLoadingDelete || isLoadingRegister}
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
							isFetching={isFetching}
						/>
					)
				}
			</Suspense>
		</>
	)
}
