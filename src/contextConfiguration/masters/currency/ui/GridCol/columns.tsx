import {
    GridColDef,
} from '@mui/x-data-grid'
import { CurrencyENTITY } from 'logiflowerp-sdk'

export const columns = (): GridColDef<CurrencyENTITY>[] => {
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
            field: 'symbol',
            headerName: 'Símbolo',
            width: 100,
            editable: true
        },
    ]
}