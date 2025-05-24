import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useDeleteProfileMutation,
	useGetProfilesQuery,
	useUpdateProfileMutation,
} from '@shared/api'
import { ProfileENTITY, State, UpdateProfileDTO } from 'logiflowerp-sdk'
import { CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutProfile() {

	const [rows, setRows] = useState<readonly ProfileENTITY[]>([])
	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<ProfileENTITY>()

	const [PUT_PROFILE_BY_ID, DELETE_PROFILE_BY_ID] = usePermissions([PERMISSIONS.PUT_PROFILE_BY_ID, PERMISSIONS.DELETE_PROFILE_BY_ID])

	const { enqueueSnackbar } = useSnackbar()
	const { data, isError, error, isLoading } = useGetProfilesQuery()
	const [updateProfile, { isLoading: isLoadingUpdate }] = useUpdateProfileMutation()
	const [deleteProfile, { isLoading: isLoadingDelete }] = useDeleteProfileMutation()
	useEffect(() => data && setRows(data), [data])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleEditClick = (row: ProfileENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleChangeStatusClick = async (row: ProfileENTITY) => {
		try {
			const dto = new UpdateProfileDTO()
			dto.set(row)
			dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
			await updateProfile({ id: row._id, data: dto }).unwrap()
			enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: ProfileENTITY) => {
		try {
			await deleteProfile(row._id).unwrap()
			enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (isError) return <CustomViewError error={error} />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid<ProfileENTITY>
					rows={rows}
					columns={columns({ handleChangeStatusClick, handleEditClick, handleDeleteClick, PUT_PROFILE_BY_ID, DELETE_PROFILE_BY_ID })}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} /> }}
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
