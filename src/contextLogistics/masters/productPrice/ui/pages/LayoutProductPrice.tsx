import { lazy, useEffect, useState } from 'react'
import { ProductPriceENTITY } from 'logiflowerp-sdk'
import {
	DataGrid,
	useGridApiRef,
} from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import {
	useDeleteProductPriceMutation,
	useGetProductPipelineQuery,
	useGetProductPricesQuery,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Box } from '@mui/material'
const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const EditDialog = lazy(() => import('../components/EditDialog').then(m => ({ default: m.EditDialog })))

export default function LayoutProductPrice() {

	const [openAdd, setOpenAdd] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selectedRow, setSelectedRow] = useState<ProductPriceENTITY>()
	const apiRef = useGridApiRef()

	const [
		POST_PRODUCT_PRICE,
		PUT_PRODUCT_PRICE_BY_ID,
		DELETE_PRODUCT_PRICE_BY_ID
	] = usePermissions([
		PERMISSIONS.POST_PRODUCT_PRICE,
		PERMISSIONS.PUT_PRODUCT_PRICE_BY_ID,
		PERMISSIONS.DELETE_PRODUCT_PRICE_BY_ID,
	])

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetProductPricesQuery()
	const pipelineProducts = [{ $match: {} }]
	const { data: dataProducts, isLoading: isLoadingProducts } = useGetProductPipelineQuery(pipelineProducts)
	const [deleteProductPrice, { isLoading: isLoadingDelete }] = useDeleteProductPriceMutation()
	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [data, dataProducts, openAdd, openEdit])

	const handleEditClick = (row: ProductPriceENTITY) => {
		try {
			setSelectedRow(row)
			setOpenEdit(true)
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleDeleteClick = async (row: ProductPriceENTITY) => {
		try {
			await deleteProductPrice(row._id).unwrap()
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
				<DataGrid<ProductPriceENTITY>
					rows={data}
					columns={columns({
						handleDeleteClick,
						handleEditClick,
						dataProducts,
						PUT_PRODUCT_PRICE_BY_ID,
						DELETE_PRODUCT_PRICE_BY_ID,
					})}
					disableRowSelectionOnClick
					slots={{
						toolbar: () => (
							<CustomToolbar
								setOpenAdd={setOpenAdd}
								AGREGAR_NUEVO_REGISTRO={POST_PRODUCT_PRICE}
							/>
						)
					}}
					showToolbar
					getRowId={row => row._id}
					density='compact'
					apiRef={apiRef}
					loading={isLoading || isLoadingDelete || isLoadingProducts}
				/>
			</Box>
			{
				openAdd && (
					<AddDialog
						open={openAdd}
						setOpen={setOpenAdd}
						dataProducts={dataProducts}
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
