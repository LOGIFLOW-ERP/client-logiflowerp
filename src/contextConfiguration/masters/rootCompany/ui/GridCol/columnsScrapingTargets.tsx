import {
    GridColDef,
    GridRowId,
    GridRowModesModel,
    GridValidRowModel
} from '@mui/x-data-grid'
import { RowActions } from '@shared/ui-library'
import { getDataScrapingSystem, ScrapingCredentialDTO } from 'logiflowerp-sdk'

interface IParams {
    handleDeleteClick: (id: GridRowId) => () => void
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    rows: readonly GridValidRowModel[]
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
}

export const columnsScrapingTargets = (params: IParams): GridColDef<ScrapingCredentialDTO>[] => {
    return [
        {
            field: 'url',
            headerName: 'URL',
            width: 200,
            editable: true
        },
        {
            field: 'userName',
            headerName: 'Nombre de usuario',
            width: 150,
            editable: true
        },
        {
            field: 'password',
            headerName: 'Contraseña',
            width: 150,
            editable: true
        },
        {
            field: 'system',
            headerName: 'Sistema',
            type: 'singleSelect',
            width: 150,
            editable: true,
            valueOptions: getDataScrapingSystem(),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => [
                <RowActions
                    id={id}
                    {...params}
                />
            ]
        },
    ]
}