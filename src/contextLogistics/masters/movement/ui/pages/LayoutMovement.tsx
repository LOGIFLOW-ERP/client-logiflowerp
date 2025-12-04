import { useEffect, useState } from 'react'
import {
    GridCellParams,
    GridRowId,
    GridRowModel,
    GridRowModesModel,
    GridValidRowModel,
} from '@mui/x-data-grid'
import { columns } from '../GridCol'
import { CreateMovementDTO, MovementENTITY, UpdateMovementDTO, validateCustom } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { CustomDataGrid, CustomViewError } from '@shared/ui-library'
import {
    useCreateMovementMutation,
    useDeleteMovementMutation,
    useGetMovementsQuery,
    useUpdateMovementMutation
} from '@shared/api'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'

export default function LayoutMovement() {

    const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const newRowTemplate: Partial<MovementENTITY & { fieldToFocus: keyof MovementENTITY }> = { ...new MovementENTITY(), fieldToFocus: 'code' }

    const [
        POST_MOVEMENT,
        DELETE_MOVEMENT_BY_ID
    ] = usePermissions([
        PERMISSIONS.POST_MOVEMENT,
        PERMISSIONS.DELETE_MOVEMENT_BY_ID,
    ])

    const { enqueueSnackbar } = useSnackbar()
    const { data: movements, error, isFetching, isError } = useGetMovementsQuery()
    const [createMovement, { isLoading: isLoadingCreate }] = useCreateMovementMutation()
    const [updateMovement, { isLoading: isLoadingUpdate }] = useUpdateMovementMutation()
    const [deleteMovement, { isLoading: isLoadingDelete }] = useDeleteMovementMutation()
    useEffect(() => movements && setRows(movements), [movements])

    const processRowUpdate = async (newRow: GridRowModel) => {
        const { isNew } = newRow
        const updatedRow = { ...newRow, isNew: false }
        try {
            if (isNew) {
                const body = await validateCustom(newRow, CreateMovementDTO, Error)
                await createMovement(body).unwrap()
            } else {
                const body = await validateCustom(newRow, UpdateMovementDTO, Error)
                await updateMovement({ id: newRow._id, data: body }).unwrap()
            }
            // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
            enqueueSnackbar({ message: '¡Éxito 🚀!', variant: 'success' })
            return updatedRow
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
            await deleteMovement(id as string).unwrap()
            // setRows(rows.filter((row) => row.id !== id))
            enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const isCellEditable = (p: GridCellParams) => {
        const row = p.row as MovementENTITY & { isNew: boolean }
        return !(['code'] as (keyof MovementENTITY)[]).includes(p.field as keyof MovementENTITY) || row.isNew
    }

    if (isError) return <CustomViewError error={error} />

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
                buttonDelete: DELETE_MOVEMENT_BY_ID
            })}
            newRowTemplate={newRowTemplate}
            processRowUpdate={processRowUpdate}
            isCellEditable={isCellEditable}
            loading={isFetching || isLoadingCreate || isLoadingUpdate || isLoadingDelete}
            buttonCreate={POST_MOVEMENT}
        />
    )
}
