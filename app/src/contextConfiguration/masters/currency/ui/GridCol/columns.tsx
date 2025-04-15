import {
    GridColDef,
    GridRowId,
    GridRowModesModel,
    GridValidRowModel
} from '@mui/x-data-grid'
import { RowActions } from '@shared/ui-library'
import { CurrencyENTITY } from 'logiflowerp-sdk'

interface IParams {
    handleDeleteClick: (id: GridRowId) => () => void
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    rows: readonly GridValidRowModel[]
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
}

export const columns = (params: IParams): GridColDef<CurrencyENTITY>[] => {
    return [
        {
            field: 'code',
            headerName: 'Código',
            width: 90,
            editable: true
        },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 180,
            editable: true
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