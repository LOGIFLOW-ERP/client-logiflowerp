import { useEffect, useState } from 'react'
import { CreateCurrencyDTO, CurrencyENTITY, UpdateCurrencyDTO, validateCustom } from 'logiflowerp-sdk'
import {
	GridCellParams,
	GridRowId,
	GridRowModel,
	GridRowModesModel,
	GridValidRowModel,
} from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import {
	useCreateCurrencyMutation,
	useDeleteCurrencyMutation,
	useGetCurrenciesQuery,
	useUpdateCurrencyMutation,
} from '@shared/api'
import { CustomDataGrid, CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { columns } from '../GridCol'

export default function LayoutCurrency() {

	const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
	const newRowTemplate: Partial<CurrencyENTITY & { fieldToFocus: keyof CurrencyENTITY }> = { code: '', name: '', fieldToFocus: 'code' }

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetCurrenciesQuery()
	const [createCurrency, { isLoading: isLoadingCreate }] = useCreateCurrencyMutation()
	const [updateCurrency, { isLoading: isLoadingUpdate }] = useUpdateCurrencyMutation()
	const [deleteCurrency, { isLoading: isLoadingDelete }] = useDeleteCurrencyMutation()
	useEffect(() => data && setRows(data), [data])

	const processRowUpdate = async (newRow: GridRowModel) => {
		const { isNew } = newRow
		const updatedRow = { ...newRow, isNew: false }
		try {
			if (isNew) {
				const body = await validateCustom(newRow, CreateCurrencyDTO, Error)
				await createCurrency(body).unwrap()
			} else {
				const body = await validateCustom(newRow, UpdateCurrencyDTO, Error)
				await updateCurrency({ id: newRow._id, data: body }).unwrap()
			}
			// setRows(rows.map((row) => (row.id === newRow._id ? updatedRow : row)))
			enqueueSnackbar({ message: '¡Éxito 🚀!', variant: 'success' })
			return updatedRow
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const handleDeleteClick = (id: GridRowId) => async () => {
		try {
			await deleteCurrency(id as string).unwrap()
			// setRows(rows.filter((row) => row.id !== id))
			enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const isCellEditable = (p: GridCellParams) => {
		const row = p.row as CurrencyENTITY & { isNew: boolean }
		return !(['code'] as (keyof CurrencyENTITY)[]).includes(p.field as keyof CurrencyENTITY) || row.isNew
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
