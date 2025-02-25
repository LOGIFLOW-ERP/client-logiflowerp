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

export default function LayoutMovement() {

    const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const newRowTemplate: Partial<MovementENTITY & { fieldToFocus: keyof MovementENTITY }> = { code: '', name: '', fieldToFocus: 'code' }

    const handleSaveClick = (id: GridRowId, isNew: boolean) => () => {
        console.log(isNew)
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
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
