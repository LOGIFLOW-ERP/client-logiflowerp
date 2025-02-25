import {
    GridColDef,
    GridRowId,
    GridRowModesModel
} from '@mui/x-data-grid'
import { RowActions } from '@shared/ui-library'

interface IParams {
    handleSaveClick: (id: GridRowId) => () => void
    handleCancelClick: (id: GridRowId) => () => void
    handleEditClick: (id: GridRowId) => () => void
    handleDeleteClick: (id: GridRowId) => () => void
    rowModesModel: GridRowModesModel
}

export const columns: (params: IParams) => GridColDef[] = (params) => {
    const { rowModesModel, handleCancelClick, handleDeleteClick, handleEditClick, handleSaveClick } = params
    return [
        { field: 'code', headerName: 'Código', width: 90, editable: true },
        { field: 'name', headerName: 'Nombre', width: 180, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => [
                <RowActions
                    id={id}
                    handleCancelClick={handleCancelClick}
                    handleDeleteClick={handleDeleteClick}
                    handleEditClick={handleEditClick}
                    handleSaveClick={handleSaveClick}
                    rowModesModel={rowModesModel}
                />
            ]
        },
    ]
}