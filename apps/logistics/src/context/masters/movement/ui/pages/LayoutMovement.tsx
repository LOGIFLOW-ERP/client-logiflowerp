import { CustomDataGrid } from '@shared/ui-library'
import { useState } from 'react'
import {
    GridRowId,
    GridRowModes,
    GridRowModesModel,
    GridValidRowModel,
} from '@mui/x-data-grid'
import { columns } from '../GridCol/columns'

export default function LayoutMovement() {

    const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    return (
        <CustomDataGrid
            rows={rows}
            setRows={setRows}
            rowModesModel={rowModesModel}
            setRowModesModel={setRowModesModel}
            columns={columns({
                handleCancelClick,
                handleDeleteClick,
                handleEditClick,
                handleSaveClick,
                rowModesModel
            })}
        />
    )
}
