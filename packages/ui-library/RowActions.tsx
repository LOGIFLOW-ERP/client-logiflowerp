import React from 'react'
import { GridActionsCellItem, GridRowId, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

interface RowActionsProps {
    id: GridRowId;
    rowModesModel: GridRowModesModel;
    handleSaveClick: (id: GridRowId) => () => void;
    handleCancelClick: (id: GridRowId) => () => void;
    handleEditClick: (id: GridRowId) => () => void;
    handleDeleteClick: (id: GridRowId) => () => void;
}

export const RowActions: React.FC<RowActionsProps> = ({
    id,
    rowModesModel,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
}) => {
    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    return isInEditMode ? (
        <>
            <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{ color: 'primary.main' }}
                onClick={handleSaveClick(id)}
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
