import { CustomDataGrid } from '@shared/ui-library'
import { useState } from 'react'
import {
    GridRowId,
    GridRowModes,
    GridRowModesModel,
    GridValidRowModel,
} from '@mui/x-data-grid'
import { columns } from '../GridCol/columns'
import { MovementENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'

export default function LayoutMovement() {

    const { enqueueSnackbar } = useSnackbar()

    const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const newRowTemplate: Partial<MovementENTITY & { fieldToFocus: keyof MovementENTITY }> = { code: '', name: '', fieldToFocus: 'code' }

    const handleSaveClick = (row: GridValidRowModel) => async () => {
        try {
            const { id, isNew, ...data } = row
            console.log(isNew)
            console.log(data)
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id))
    }

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
