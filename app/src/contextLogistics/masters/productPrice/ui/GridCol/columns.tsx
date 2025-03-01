import {
    GridColDef,
    GridRowId,
    GridRowModesModel,
    GridValidRowModel,
} from '@mui/x-data-grid'
import { RowActions } from '@shared/ui-library'
import { CurrencyENTITY } from 'logiflowerp-sdk'

interface IParams {
    handleDeleteClick: (id: GridRowId) => () => void
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    rows: readonly GridValidRowModel[]
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
    dataCurrency: CurrencyENTITY[]
}

export const columns = <T extends GridValidRowModel,>(params: IParams): GridColDef<T>[] => {
    return [
        {
            field: 'itemCode',
            headerName: 'Código',
            width: 90,
            editable: true
        },
        {
            field: 'currencyCode',
            headerName: 'Divisa',
            type: 'singleSelect',
            width: 180,
            editable: true,
            valueOptions: params.dataCurrency.map(e => ({ value: e.code, label: e.name })),
            valueSetter: (value, row) => {
                const currency = params.dataCurrency.find(e => e.code === value)
                if (!currency) return row
                return { ...row, currency }
            },
        },
        {
            field: 'price',
            headerName: 'Precio',
            type: 'number',
            width: 80,
            align: 'left',
            headerAlign: 'left',
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