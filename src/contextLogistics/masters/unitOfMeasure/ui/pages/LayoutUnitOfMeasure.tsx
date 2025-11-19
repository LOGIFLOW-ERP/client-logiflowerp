import { useEffect, useState } from 'react'
import {
	CreateUnitOfMeasureDTO,
	UnitOfMeasureENTITY,
	UpdateUnitOfMeasureDTO,
	validateCustom
} from 'logiflowerp-sdk'
import {
	GridCellParams,
	// GridRowId,
	GridRowModel,
	GridRowModesModel,
	GridValidRowModel,
} from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import {
	useCreateUnitOfMeasureMutation,
	// useDeleteUnitOfMeasureMutation,
	useGetUnitOfMeasuresQuery,
	useUpdateUnitOfMeasureMutation
} from '@shared/api'
import { CustomDataGrid, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
// import { usePermissions } from '@shared/ui/hooks'
// import { PERMISSIONS } from '@shared/application'

export default function LayoutUnitOfMeasure() {

	const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
	const newRowTemplate: Partial<UnitOfMeasureENTITY & { fieldToFocus: keyof UnitOfMeasureENTITY }> = {
		uomCode: '', uomName: '', fieldToFocus: 'uomCode'
	}

	// const [
	// 	POST_UNIT_OF_MEASURE,
	// 	PUT_UNIT_OF_MEASURE_BY_ID,
	// 	DELETE_UNIT_OF_MEASURE_BY_ID
	// ] = usePermissions([
	// 	PERMISSIONS.POST_UNIT_OF_MEASURE,
	// 	PERMISSIONS.PUT_UNIT_OF_MEASURE_BY_ID,
	// 	PERMISSIONS.DELETE_UNIT_OF_MEASURE_BY_ID,
	// ])

	const { enqueueSnackbar } = useSnackbar()
	const { data, error, isLoading } = useGetUnitOfMeasuresQuery()
	const [createUnitOfMeasure, { isLoading: isLoadingCreate }] = useCreateUnitOfMeasureMutation()
	const [updateUnitOfMeasure, { isLoading: isLoadingUpdate }] = useUpdateUnitOfMeasureMutation()
	// const [deleteUnitOfMeasure, { isLoading: isLoadingDelete }] = useDeleteUnitOfMeasureMutation()
	useEffect(() => data && setRows(data), [data])

	const processRowUpdate = async (newRow: GridRowModel) => {
		const { isNew } = newRow
		const updatedRow = { ...newRow, isNew: false }
		try {
			if (isNew) {
				const body = await validateCustom(newRow, CreateUnitOfMeasureDTO, Error)
				await createUnitOfMeasure(body).unwrap()
			} else {
				const body = await validateCustom(newRow, UpdateUnitOfMeasureDTO, Error)
				await updateUnitOfMeasure({ id: newRow._id, data: body }).unwrap()
			}
			// setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
			enqueueSnackbar({ message: '¡Éxito 🚀!', variant: 'success' })
			return updatedRow
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	// const handleDeleteClick = (id: GridRowId) => async () => {
	// 	try {
	// 		await deleteUnitOfMeasure(id as string).unwrap()
	// 		// setRows(rows.filter((row) => row.id !== id))
	// 		enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
	// 	} catch (error) {
	// 		console.error(error)
	// 		enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
	// 	}
	// }

	const isCellEditable = (p: GridCellParams) => {
		const row = p.row as UnitOfMeasureENTITY & { isNew: boolean }
		return !(['uomCode'] as (keyof UnitOfMeasureENTITY)[]).includes(p.field as keyof UnitOfMeasureENTITY) || row.isNew
	}

	if (error) return <CustomViewError />

	return (
		<CustomDataGrid
			rows={rows}
			setRows={setRows}
			rowModesModel={rowModesModel}
			setRowModesModel={setRowModesModel}
			columns={columns(
				// {
				// handleDeleteClick,
				// rowModesModel,
				// setRowModesModel,
				// rows,
				// setRows,
				// buttonEdit: PUT_UNIT_OF_MEASURE_BY_ID,
				// buttonDelete: DELETE_UNIT_OF_MEASURE_BY_ID,
				// }
			)}
			newRowTemplate={newRowTemplate}
			processRowUpdate={processRowUpdate}
			isCellEditable={isCellEditable}
			loading={isLoading || isLoadingCreate || isLoadingUpdate}
		// loading={isLoading || isLoadingCreate || isLoadingUpdate || isLoadingDelete}
		// buttonCreate={POST_UNIT_OF_MEASURE}
		/>
	)
}
