import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useDeleteCompanyMutation,
	useGetCompaniesQuery,
	useUpdateCompanyMutation,
} from '@shared/api'
import { CompanyENTITY, State, UpdateCompanyDTO } from 'logiflowerp-sdk'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
// import { CustomToolbar } from '../components'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutCompany() {

	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<CompanyENTITY>()
	const apiRef = useGridApiRef()

	const [
		POST_COMPANY,
		PUT_COMPANY_BY_ID,
		DELETE_COMPANY_BY_ID,
	] = usePermissions([
		PERMISSIONS.POST_COMPANY,
		PERMISSIONS.PUT_COMPANY_BY_ID,
		PERMISSIONS.DELETE_COMPANY_BY_ID,
	])

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isFetching } = useGetCompaniesQuery()
	const [updateCompany, { isLoading: isLoadingUpdate }] = useUpdateCompanyMutation()
	const [deleteCompany, { isLoading: isLoadingDelete }] = useDeleteCompanyMutation()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, openAdd, openEdit, isFetching])

	const handleEditClick = (row: CompanyENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleChangeStatusClick = async (row: CompanyENTITY) => {
		try {
			const dto = new UpdateCompanyDTO()
			dto.set(row)
			dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
			await updateCompany({ id: row._id, data: dto }).unwrap()
			enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: CompanyENTITY) => {
		try {
			await deleteCompany(row._id).unwrap()
			enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	if (error) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: '85vh', width: '100%' }}>
				<DataGrid<CompanyENTITY>
					rows={data}
					columns={columns({ handleChangeStatusClick, handleEditClick, handleDeleteClick, DELETE_COMPANY_BY_ID, PUT_COMPANY_BY_ID })}
					disableRowSelectionOnClick
					slots={{
						toolbar: () => (
							<CustomToolbar
								setOpenAdd={setOpenAdd}
								AGREGAR_NUEVO_REGISTRO={POST_COMPANY}
							/>
						)
					}}
					getRowId={row => row._id}
					loading={isFetching || isLoadingUpdate || isLoadingDelete}
					density='compact'
					showToolbar
					apiRef={apiRef}
					autoPageSize
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
