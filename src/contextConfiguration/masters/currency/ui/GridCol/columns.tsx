import {
    GridColDef,
} from '@mui/x-data-grid'
import { CurrencyENTITY } from 'logiflowerp-sdk'

export const columns = (): GridColDef<CurrencyENTITY>[] => {
    return [
        {
            field: 'code',
            headerName: 'Código',
            editable: true
        },
        {
            field: 'name',
            headerName: 'Nombre',
            editable: true
        },
        {
            field: 'symbol',
            headerName: 'Símbolo',
            editable: true
        },
    ]
}