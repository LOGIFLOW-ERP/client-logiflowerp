import { lazy, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'
import {
	useDeleteWarehouseExitMutation,
	useGetWarehouseExitPipelineQuery,
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { WarehouseExitENTITY, StateOrder } from 'logiflowerp-sdk'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
import { Box, Typography } from '@mui/material'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))

export default function LayoutWarehouseExit() {

	const [openAdd, setOpenAdd] = useState(false)
	const { setState } = useStore('warehouseExit')

	const [canDeleteWarehouseExitByID] = usePermissions([PERMISSIONS.DELETE_WAREHOUSE_EXIT_BY_ID])
	const { enqueueSnackbar } = useSnackbar()
	const pipeline = [{ $match: { state: StateOrder.REGISTRADO } }]
	const { data, error, isLoading } = useGetWarehouseExitPipelineQuery(pipeline)
	const [deleteWarehouseExit, { isLoading: isLoadingDelete }] = useDeleteWarehouseExitMutation()

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
			setState({ selectedDocument: null })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleEditClick = (row: WarehouseExitENTITY) => {
		try {
			setState({ selectedDocument: row })
			setOpenAdd(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: WarehouseExitENTITY) => {
		try {
			await deleteWarehouseExit(row._id).unwrap()
			enqueueSnackbar({ message: '¡Documento eliminado!', variant: 'success' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (error) return <CustomViewError />

	return (
		<>
			<Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6">Documentos de Salida No Validados</Typography>
				</Box>
				<Box sx={{ height: '94%' }}>
					<DataGrid<WarehouseExitENTITY>
						rows={data}
						columns={columns({ handleEditClick, handleDeleteClick, canDeleteWarehouseExitByID })}
						disableRowSelectionOnClick
						slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} /> }}
						getRowId={row => row._id}
						loading={isLoading || isLoadingDelete}
						autoPageSize
					/>
				</Box>
			</Paper>
			{
				openAdd && (
					<AddDialog
						open={openAdd}
						setOpen={setOpenAdd}
					/>
				)
			}
		</>
	)
}
