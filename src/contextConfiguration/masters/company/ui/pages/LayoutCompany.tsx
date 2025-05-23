import { lazy, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useDeleteCompanyMutation,
	useGetCompaniesQuery,
	useUpdateCompanyMutation,
} from '@shared/api'
import { CompanyENTITY, State, UpdateCompanyDTO } from 'logiflowerp-sdk'
import { CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { CustomToolbar } from '../components'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutCompany() {

	const [rows, setRows] = useState<readonly CompanyENTITY[]>([])
	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<CompanyENTITY>()

	const [PUT_COMPANY_BY_ID, DELETE_COMPANY_BY_ID] = usePermissions([PERMISSIONS.PUT_COMPANY_BY_ID, PERMISSIONS.DELETE_COMPANY_BY_ID])

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetCompaniesQuery()
	const [updateCompany, { isLoading: isLoadingUpdate }] = useUpdateCompanyMutation()
	const [deleteCompany, { isLoading: isLoadingDelete }] = useDeleteCompanyMutation()
	useEffect(() => data && setRows(data), [data])

	const handleAddClick = () => {
		try {
			setOpenAdd(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleEditClick = (row: CompanyENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleChangeStatusClick = async (row: CompanyENTITY) => {
		try {
			const dto = new UpdateCompanyDTO()
			dto.set(row)
			dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
			await updateCompany({ id: row._id, data: dto }).unwrap()
			enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: CompanyENTITY) => {
		try {
			await deleteCompany(row._id).unwrap()
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
				<DataGrid<CompanyENTITY>
					rows={rows}
					columns={columns({ handleChangeStatusClick, handleEditClick, handleDeleteClick, DELETE_COMPANY_BY_ID, PUT_COMPANY_BY_ID })}
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
