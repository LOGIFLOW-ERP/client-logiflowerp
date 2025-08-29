import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
	useGetProductGroupsQuery,
	useGetProductsQuery,
	useUpdateProductMutation,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { State, ProductENTITY, UpdateProductDTO } from 'logiflowerp-sdk'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))
const CustomFilters = lazy(() => import('../components/CustomFilters').then(m => ({ default: m.CustomFilters })))

export default function LayoutProduct() {

	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<ProductENTITY>()
	const apiRef = useGridApiRef()

	const [PUT_PRODUCT_BY_ID, POST_PRODUCT] = usePermissions([
		PERMISSIONS.PUT_PRODUCT_BY_ID,
		PERMISSIONS.POST_PRODUCT
	])

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetProductsQuery()
	const { data: dataProductGroups, error: errorProductGroups, isLoading: isLoadingProductGroups } = useGetProductGroupsQuery()
	const [updateStore, { isLoading: isLoadingUpdate }] = useUpdateProductMutation()
	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, dataProductGroups, openAdd, openEdit])

	const handleEditClick = (row: ProductENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleChangeStatusClick = async (row: ProductENTITY) => {
		try {
			const dto = new UpdateProductDTO()
			dto.set(row)
			dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
			await updateStore({ id: row._id, data: dto }).unwrap()
			enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	if (error || errorProductGroups) return <CustomViewError />

	return (
		<>
			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid<ProductENTITY>
					rows={data}
					columns={columns({ handleChangeStatusClick, handleEditClick, PUT_PRODUCT_BY_ID, dataProductGroups })}
					disableRowSelectionOnClick
					slots={{
						toolbar: () => (
							<CustomToolbar
								setOpenAdd={setOpenAdd}
								AGREGAR_NUEVO_REGISTRO={POST_PRODUCT}
								children={<CustomFilters />}
							/>
						),
					}}
					showToolbar
					getRowId={row => row._id}
					density='compact'
					apiRef={apiRef}
					loading={isLoading || isLoadingUpdate || isLoadingProductGroups}
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