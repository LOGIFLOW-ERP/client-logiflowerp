import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useDeleteStoreMutation,
	useGetStoresQuery,
	useUpdateStoreMutation,
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
import { State, StoreENTITY, UpdateStoreDTO } from 'logiflowerp-sdk'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutStore() {

	const [rows, setRows] = useState<readonly StoreENTITY[]>([])
	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<StoreENTITY>()

	const [PUT_STORE_BY_ID, DELETE_STORE_BY_ID] = usePermissions([
		PERMISSIONS.PUT_STORE_BY_ID,
		PERMISSIONS.DELETE_STORE_BY_ID
	])

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetStoresQuery()
	const [updateStore, { isLoading: isLoadingUpdate }] = useUpdateStoreMutation()
	const [deleteStore, { isLoading: isLoadingDelete }] = useDeleteStoreMutation()
	useEffect(() => data && setRows(data), [data])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleEditClick = (row: StoreENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleChangeStatusClick = async (row: StoreENTITY) => {
		try {
			const dto = new UpdateStoreDTO()
			dto.set(row)
			dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
			await updateStore({ id: row._id, data: dto }).unwrap()
			enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: StoreENTITY) => {
		try {
			await deleteStore(row._id).unwrap()
			enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (error) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid<StoreENTITY>
					rows={rows}
					columns={columns({ handleChangeStatusClick, handleEditClick, handleDeleteClick, DELETE_STORE_BY_ID, PUT_STORE_BY_ID })}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} /> }}
					showToolbar
					getRowId={row => row._id}
					loading={isLoading || isLoadingUpdate || isLoadingDelete}
					density='compact'
				/>
			</Box>
			{
				openAdd && (
					<AddDialog
						open={openAdd}
						setOpen={setOpenAdd}
					/>
				)
			}
			{
				(openEdit && selectedRow) && (
					<EditDialog
						open={openEdit}
						setOpen={setOpenEdit}
						row={selectedRow}
					/>
				)
			}
		</>
	)
}
