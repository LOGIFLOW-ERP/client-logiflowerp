import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useDeletePersonnelMutation,
	useGetPersonnelsQuery,
	useGetProfilesQuery,
	useUpdatePersonnelMutation,
} from '@shared/api'
import { EmployeeENTITY, State, UpdateEmployeeDTO } from 'logiflowerp-sdk'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutPersonnel() {
	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<EmployeeENTITY>()
	const apiRef = useGridApiRef()

	const [
		POST_PERSONNEL,
		PUT_PERSONNEL_BY_ID,
		DELETE_PERSONNEL_BY_ID,
	] = usePermissions([
		PERMISSIONS.POST_PERSONNEL,
		PERMISSIONS.PUT_PERSONNEL_BY_ID,
		PERMISSIONS.DELETE_PERSONNEL_BY_ID
	])

	const { enqueueSnackbar } = useSnackbar()
	const { data, isError, isLoading } = useGetPersonnelsQuery()
	const [updatePersonnel, { isLoading: isLoadingUpdate }] = useUpdatePersonnelMutation()
	const [deletePersonnel, { isLoading: isLoadingDelete }] = useDeletePersonnelMutation()
	const { data: dataProfiles, isError: isErrorProfiles, isLoading: isLoadingProfiles } = useGetProfilesQuery()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, dataProfiles, openAdd, openEdit])

	const handleEditClick = (row: EmployeeENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleChangeStatusClick = async (row: EmployeeENTITY) => {
		try {
			const dto = new UpdateEmployeeDTO()
			dto.set(row)
			dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
			await updatePersonnel({ id: row._id, data: dto }).unwrap()
			enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: EmployeeENTITY) => {
		try {
			await deletePersonnel(row._id).unwrap()
			enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	if (isError || isErrorProfiles) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: '85vh', width: '100%' }}>
				<DataGrid<EmployeeENTITY>
					rows={data}
					columns={columns({
						handleChangeStatusClick,
						handleEditClick,
						handleDeleteClick,
						dataProfiles,
						DELETE_PERSONNEL_BY_ID,
						PUT_PERSONNEL_BY_ID
					})}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar setOpenAdd={setOpenAdd} AGREGAR_NUEVO_REGISTRO={POST_PERSONNEL} /> }}
					getRowId={row => row._id}
					loading={isLoading || isLoadingUpdate || isLoadingDelete || isLoadingProfiles}
					density='compact'
					showToolbar
					autoPageSize
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
