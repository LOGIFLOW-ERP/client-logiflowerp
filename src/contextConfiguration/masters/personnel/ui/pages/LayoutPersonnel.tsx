import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useGetPersonnelsQuery,
	useGetProfilesQuery,
	useUpdatePersonnelMutation,
} from '@shared/api'
import { EmployeeENTITY, State, UpdateEmployeeDTO } from 'logiflowerp-sdk'
import { CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutPersonnel() {

	const [rows, setRows] = useState<readonly EmployeeENTITY[]>([])
	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<EmployeeENTITY>()

	const { enqueueSnackbar } = useSnackbar()
	const { data, isError, isLoading } = useGetPersonnelsQuery()
	const [updatePersonnel, { isLoading: isLoadingUpdate }] = useUpdatePersonnelMutation()
	const { data: dataProfiles, isError: isErrorProfiles, isLoading: isLoadingProfiles } = useGetProfilesQuery()
	useEffect(() => data && setRows(data), [data])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleEditClick = (row: EmployeeENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleChangeStatusClick = async (row: EmployeeENTITY) => {
		try {
			const dto = new UpdateEmployeeDTO()
			dto.set(row)
			dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
			await updatePersonnel({ id: row._id, data: dto }).unwrap()
			enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (isLoading || isLoadingUpdate || isLoadingProfiles) return <CustomViewLoading />
	if (isError || isErrorProfiles || !dataProfiles) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid<EmployeeENTITY>
					rows={rows}
					columns={columns({ handleChangeStatusClick, handleEditClick, dataProfiles })}
					disableRowSelectionOnClick
					slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} /> }}
					getRowId={row => row._id}
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
