import { useEffect, useState } from 'react'
import { CreateProductGroupDTO, ProductGroupENTITY, UpdateProductGroupDTO, validateCustom } from 'logiflowerp-sdk'
import {
	GridCellParams,
	GridRowId,
	GridRowModel,
	GridRowModesModel,
	GridValidRowModel,
} from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import {
	useCreateProductGroupMutation,
	useDeleteProductGroupMutation,
	useGetProductGroupsQuery,
	useUpdateProductGroupMutation
} from '@shared/api'
import { CustomDataGrid, CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'

export default function LayoutProductGroup() {

	const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
	const newRowTemplate: Partial<ProductGroupENTITY & { fieldToFocus: keyof ProductGroupENTITY }> = { itmsGrpCod: '', itmsGrpNam: '', fieldToFocus: 'itmsGrpCod' }

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetProductGroupsQuery()
	const [createProductGroup, { isLoading: isLoadingCreate }] = useCreateProductGroupMutation()
	const [updateProductGroup, { isLoading: isLoadingUpdate }] = useUpdateProductGroupMutation()
	const [deleteProductGroup, { isLoading: isLoadingDelete }] = useDeleteProductGroupMutation()
	useEffect(() => data && setRows(data), [data])

	const processRowUpdate = async (newRow: GridRowModel) => {
		const { isNew } = newRow
		const updatedRow = { ...newRow, isNew: false }
		try {
			if (isNew) {
				const body = await validateCustom(newRow, CreateProductGroupDTO, Error)
				await createProductGroup(body).unwrap()
			} else {
				const body = await validateCustom(newRow, UpdateProductGroupDTO, Error)
				await updateProductGroup({ id: newRow._id, data: body }).unwrap()
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
			await deleteProductGroup(id as string).unwrap()
			// setRows(rows.filter((row) => row.id !== id))
			enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const isCellEditable = (p: GridCellParams) => {
		const row = p.row as ProductGroupENTITY & { isNew: boolean }
		return !(['itmsGrpCod'] as (keyof ProductGroupENTITY)[]).includes(p.field as keyof ProductGroupENTITY) || row.isNew
	}

	if (isLoading || isLoadingCreate || isLoadingUpdate || isLoadingDelete) return <CustomViewLoading />
	if (error) return <CustomViewError />

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
				setRows
			})}
			newRowTemplate={newRowTemplate}
			processRowUpdate={processRowUpdate}
			isCellEditable={isCellEditable}
		/>
	)
}
