import { GridColDef } from '@mui/x-data-grid'
import { EmployeeStockENTITYFlat } from 'logiflowerp-sdk'

interface IParams {
}

export const columns_ = (params: IParams): GridColDef<EmployeeStockENTITYFlat>[] => {
    const { } = params
    return [
        {
            field: 'stockType',
            headerName: 'Tipo',
        },
        {
            field: 'store_company_code',
            headerName: 'Empresa',
        },
        {
            field: 'store_code',
            headerName: 'Almacén',
        },
        {
            field: 'employee_identity',
            headerName: 'Identificación',
        },
        {
            field: 'personal',
            headerName: 'Personal',
            valueGetter: (_value, row) => {
                return `${row.employee_names} ${row.employee_surnames}`
            }
        },
        {
            field: 'item_itemCode',
            headerName: 'Código',
        },
        {
            field: 'item_itemName',
            headerName: 'Nombre',
        },
        {
            field: 'item_uomCode',
            headerName: 'UM',
        },
        {
            field: 'lot',
            headerName: 'Lote',
        },
        {
            field: 'incomeAmount',
            headerName: 'Ingreso',
            type: 'number'
        },
        {
            field: 'amountReturned',
            headerName: 'Devolución',
            type: 'number'
        },
        {
            field: 'amountConsumed',
            headerName: 'Consumo',
            type: 'number'
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number'
        },
    ]
}
