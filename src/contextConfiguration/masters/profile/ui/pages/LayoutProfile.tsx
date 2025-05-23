import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useGetProfilesQuery,
	useUpdateProfileMutation,
} from '@shared/api'
import { ProfileENTITY, State, UpdateProfileDTO } from 'logiflowerp-sdk'
import { CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutProfile() {

	const [rows, setRows] = useState<readonly ProfileENTITY[]>([])
	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<ProfileENTITY>()

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetProfilesQuery()
	const [updateProfile, { isLoading: isLoadingUpdate }] = useUpdateProfileMutation()
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

	if (isLoadingUpdate) return <CustomViewLoading />
	if (error) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid<ProfileENTITY>
					rows={rows}
					columns={columns({ handleChangeStatusClick, handleEditClick })}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} /> }}
					getRowId={row => row._id}
					loading={isLoading}
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
