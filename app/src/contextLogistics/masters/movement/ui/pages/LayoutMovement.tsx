import { useEffect, useState } from 'react'
import {
    GridCellParams,
    GridRowId,
    GridRowModel,
    GridRowModesModel,
    GridValidRowModel,
} from '@mui/x-data-grid'
import { columns } from '../GridCol'
import { MovementENTITY, validateCustom } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { CustomDataGrid, CustomViewError, CustomViewLoading } from '@shared/ui-library'
import {
    useCreateMovementMutation,
    useDeleteMovementMutation,
    useGetMovementsQuery,
    useUpdateMovementMutation
} from '@shared/api'

export default function LayoutMovement() {

    const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const newRowTemplate: Partial<MovementENTITY & { fieldToFocus: keyof MovementENTITY }> = { code: '', name: '', fieldToFocus: 'code' }

    const { enqueueSnackbar } = useSnackbar()
    const { data: movements, error, isLoading } = useGetMovementsQuery()
    const [createMovement, { isLoading: isLoadingCreate }] = useCreateMovementMutation()
    const [updateMovement, { isLoading: isLoadingUpdate }] = useUpdateMovementMutation()
    const [deleteMovement, { isLoading: isLoadingDelete }] = useDeleteMovementMutation()
    useEffect(() => movements && setRows(movements.map(e => ({ ...e, id: e._id }))), [movements])

    const processRowUpdate = async (newRow: GridRowModel) => {
        const { isNew } = newRow
        const updatedRow = { ...newRow, isNew: false }
        try {
            const entity = new MovementENTITY()
            entity._id = crypto.randomUUID()
            entity.set(newRow)
            const body = await validateCustom(entity, MovementENTITY, Error)
            if (isNew) {
                await createMovement(body).unwrap()
            } {
                await updateMovement({ id: body._id, data: body }).unwrap()
            }
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
            enqueueSnackbar({ message: '¡Éxito 🚀!', variant: 'success' })
            return updatedRow
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
            await deleteMovement(id as string).unwrap()
            setRows(rows.filter((row) => row.id !== id))
            enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const isCellEditable = (p: GridCellParams) => !['code'].includes(p.field) || p.row.isNew

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
