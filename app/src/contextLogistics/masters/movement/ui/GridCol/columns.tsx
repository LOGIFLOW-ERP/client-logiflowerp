import {
    GridColDef,
    GridRowId,
    GridRowModesModel,
    GridValidRowModel
} from '@mui/x-data-grid'
import { RowActions } from '@shared/ui-library'
import { getDataMovementOrder, getDataStockType, MovementENTITY } from 'logiflowerp-sdk'

interface IParams {
    handleDeleteClick: (id: GridRowId) => () => void
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    rows: readonly GridValidRowModel[]
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
}

export const columns = (params: IParams): GridColDef<MovementENTITY>[] => {
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
            field: 'movement',
            headerName: 'Movimiento',
            type: 'singleSelect',
            width: 150,
            editable: true,
            valueOptions: getDataMovementOrder(),
        },
        {
            field: 'stockType',
            headerName: 'Tipo Stock',
            type: 'singleSelect',
            width: 150,
            editable: true,
            valueOptions: getDataStockType(),
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