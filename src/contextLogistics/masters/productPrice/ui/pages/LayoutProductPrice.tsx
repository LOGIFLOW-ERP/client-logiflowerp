import { useEffect, useState } from 'react'
import { CreateProductPriceDTO, ProductPriceENTITY, State, UpdateProductPriceDTO, validateCustom } from 'logiflowerp-sdk'
import {
	GridCellParams,
	GridRowId,
	GridRowModel,
	GridRowModesModel,
	GridValidRowModel,
} from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import {
	useCreateProductPriceMutation,
	useDeleteProductPriceMutation,
	useGetProductPipelineQuery,
	useGetProductPricesQuery,
	useUpdateProductPriceMutation,
} from '@shared/api'
import { CustomDataGrid, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'

export default function LayoutProductPrice() {

	const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
	const newRowTemplate: Partial<ProductPriceENTITY & { fieldToFocus: keyof ProductPriceENTITY, currencyCode: string }> = {
		fieldToFocus: 'itemCode', ...new ProductPriceENTITY()
	}

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetProductPricesQuery()
	const pipelineProducts = [{ $match: { state: State.ACTIVO } }]
	const { data: dataProducts, isLoading: isLoadingProducts } = useGetProductPipelineQuery(pipelineProducts)
	const [createProductPrice, { isLoading: isLoadingCreate }] = useCreateProductPriceMutation()
	const [updateProductPrice, { isLoading: isLoadingUpdate }] = useUpdateProductPriceMutation()
	const [deleteProductPrice, { isLoading: isLoadingDelete }] = useDeleteProductPriceMutation()
	useEffect(() => data && setRows(data), [data])

	const processRowUpdate = async (newRow: GridRowModel) => {
		const { isNew } = newRow
		const updatedRow = { ...newRow, isNew: false }
		try {
			if (isNew) {
				const body = await validateCustom(newRow, CreateProductPriceDTO, Error)
				await createProductPrice(body).unwrap()
			} else {
				const body = await validateCustom(newRow, UpdateProductPriceDTO, Error)
				await updateProductPrice({ id: newRow._id, data: body }).unwrap()
			}
			// setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
			enqueueSnackbar({ message: '¡Éxito 🚀!', variant: 'success' })
			return updatedRow
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleDeleteClick = (id: GridRowId) => async () => {
		try {
			await deleteProductPrice(id as string).unwrap()
			// setRows(rows.filter((row) => row.id !== id))
			enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const isCellEditable = (p: GridCellParams) => {
		const row = p.row as ProductPriceENTITY & { isNew: boolean }
		return !(['itemCode'] as (keyof ProductPriceENTITY)[]).includes(p.field as keyof ProductPriceENTITY) || row.isNew
	}

	if (error || !dataProducts) return <CustomViewError />

	return (
		<CustomDataGrid
			rows={rows}
			setRows={setRows}
			rowModesModel={rowModesModel}
			setRowModesModel={setRowModesModel}
			columns={columns({
				handleDeleteClick,
				rowModesModel,
				setRowModesModel,
				rows,
				setRows,
				dataProducts
			})}
			newRowTemplate={newRowTemplate}
			processRowUpdate={processRowUpdate}
			isCellEditable={isCellEditable}
			loading={
				isLoading ||
				isLoadingCreate ||
				isLoadingUpdate ||
				isLoadingDelete ||
				isLoadingProducts
			}
		/>
	)
}
