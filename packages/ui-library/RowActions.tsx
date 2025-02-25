import React from 'react'
import { GridActionsCellItem, GridRowId, GridRowModes, GridRowModesModel, GridValidRowModel } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

interface RowActionsProps {
    id: GridRowId;
    row: GridValidRowModel;
    rowModesModel: GridRowModesModel;
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    handleSaveClick: (row: GridValidRowModel) => () => void;
    handleDeleteClick: (id: GridRowId) => () => void;
    rows: readonly GridValidRowModel[]
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
}

export const RowActions: React.FC<RowActionsProps> = ({
    id,
    row,
    rowModesModel,
    setRowModesModel,
    handleSaveClick,
    handleDeleteClick,
    rows,
    setRows
}) => {

    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        })

        const editedRow = rows.find((row) => row.id === id)
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id))
        }
    }

    return isInEditMode ? (
        <>
            <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{ color: 'primary.main' }}
                onClick={handleSaveClick(row)}
            />
            <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
            />
        </>
    ) : (
        <>
            <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
            />
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
            />
        </>
    );
}
