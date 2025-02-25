import { CustomDataGrid, CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { useEffect, useState } from 'react'
import {
    GridRowId,
    GridRowModes,
    GridRowModesModel,
    GridValidRowModel,
} from '@mui/x-data-grid'
import { columns } from '../GridCol/columns'
import { MovementENTITY, validateCustom } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { useGetMovementsQuery, useCreateMovementMutation } from '@shared/api'

export default function LayoutMovement() {

    const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const newRowTemplate: Partial<MovementENTITY & { fieldToFocus: keyof MovementENTITY }> = { code: '', name: '', fieldToFocus: 'code' }

    const { enqueueSnackbar } = useSnackbar()
    const { data: movements, error, isLoading } = useGetMovementsQuery()
    const [createMovement, { isLoading: isLoadingCreate }] = useCreateMovementMutation()
    useEffect(() => movements && setRows(movements), [movements])

    const handleSaveClick = (row: GridValidRowModel) => async () => {
        try {
            const { id, isNew, ...data } = row
            const entity = new MovementENTITY()
            entity.set(data)
            const body = await validateCustom(entity, MovementENTITY, Error)
            if (isNew) {
                await createMovement(body).unwrap()
            }
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
            enqueueSnackbar({ message: '¡Cambios guardados!', variant: 'success' })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id))
    }

    if (isLoading || isLoadingCreate) return <CustomViewLoading />
    if (error) return <CustomViewError />

    return (
        <CustomDataGrid
            rows={rows}
            setRows={setRows}
            rowModesModel={rowModesModel}
            setRowModesModel={setRowModesModel}
            columns={columns({
                handleDeleteClick,
                handleSaveClick,
                rowModesModel,
                setRowModesModel,
                rows,
                setRows
            })}
            newRowTemplate={newRowTemplate}
        />
    )
}
