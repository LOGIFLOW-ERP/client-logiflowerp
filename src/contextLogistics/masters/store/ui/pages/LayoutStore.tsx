import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useDeleteStoreMutation,
	useGetStoresQuery,
	useUpdateStoreMutation,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { State, StoreENTITY, UpdateStoreDTO } from 'logiflowerp-sdk'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutStore() {
	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<StoreENTITY>()
	const apiRef = useGridApiRef()

	const [
		POST_STORE,
		PUT_STORE_BY_ID,
		DELETE_STORE_BY_ID,
	] = usePermissions([
		PERMISSIONS.POST_STORE,
		PERMISSIONS.PUT_STORE_BY_ID,
		PERMISSIONS.DELETE_STORE_BY_ID
	])

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetStoresQuery()
	const [updateStore, { isLoading: isLoadingUpdate }] = useUpdateStoreMutation()
	const [deleteStore, { isLoading: isLoadingDelete }] = useDeleteStoreMutation()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, openAdd, openEdit])

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
			<Box sx={{ height: '85vh', width: '100%' }}>
				<DataGrid<StoreENTITY>
					rows={data}
					columns={columns({ handleChangeStatusClick, handleEditClick, handleDeleteClick, DELETE_STORE_BY_ID, PUT_STORE_BY_ID })}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar setOpenAdd={setOpenAdd} AGREGAR_NUEVO_REGISTRO={POST_STORE} /> }}
					showToolbar
					autoPageSize
					getRowId={row => row._id}
					loading={isLoading || isLoadingUpdate || isLoadingDelete}
					density='compact'
					apiRef={apiRef}
				/>
			</Box>
			<Suspense fallback={<Fallback />}>
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
			</Suspense>
		</>
	)
}
