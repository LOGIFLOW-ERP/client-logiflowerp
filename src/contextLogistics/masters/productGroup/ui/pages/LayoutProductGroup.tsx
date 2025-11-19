import { lazy, Suspense, useEffect, useState } from 'react'
import {
	ProductGroupENTITY,
} from 'logiflowerp-sdk'
import {
	DataGrid,
	useGridApiRef,
} from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import {
	useDeleteProductGroupMutation,
	useGetProductGroupsQuery,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Box } from '@mui/material'
import { Fallback } from '@app/ui/pages'

const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutProductGroup() {

	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<ProductGroupENTITY>()
	const apiRef = useGridApiRef()

	const [
		POST_PRODUCT_GROUP,
		PUT_PRODUCT_GROUP_BY_ID,
		DELETE_PRODUCT_GROUP_BY_ID
	] = usePermissions([
		PERMISSIONS.POST_PRODUCT_GROUP,
		PERMISSIONS.PUT_PRODUCT_GROUP_BY_ID,
		PERMISSIONS.DELETE_PRODUCT_GROUP_BY_ID,
	])

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isFetching } = useGetProductGroupsQuery()
	const [deleteProductGroup, { isLoading: isLoadingDelete }] = useDeleteProductGroupMutation()
	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, openAdd, openEdit])

	const handleEditClick = (row: ProductGroupENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: ProductGroupENTITY) => {
		try {
			await deleteProductGroup(row._id).unwrap()
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
				<DataGrid<ProductGroupENTITY>
					rows={data}
					columns={columns({
						handleDeleteClick,
						handleEditClick,
						PUT_PRODUCT_GROUP_BY_ID,
						DELETE_PRODUCT_GROUP_BY_ID,
					})}
					disableRowSelectionOnClick
					slots={{
						toolbar: () => (
							<CustomToolbar
								setOpenAdd={setOpenAdd}
								AGREGAR_NUEVO_REGISTRO={POST_PRODUCT_GROUP}
							/>
						)
					}}
					showToolbar
					getRowId={row => row._id}
					density='compact'
					apiRef={apiRef}
					loading={isFetching || isLoadingDelete}
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
