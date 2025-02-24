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
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 80,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'joinDate',
            headerName: 'Join date',
            type: 'date',
            width: 180,
            editable: true,
        },
        {
            field: 'role',
            headerName: 'Department',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Market', 'Finance', 'Development'],
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
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