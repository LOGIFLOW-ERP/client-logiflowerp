import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { EmployeeStockENTITYFlat } from 'logiflowerp-sdk'

export const columnsEmployeeStock = (): GridColDef<EmployeeStockENTITYFlat>[] => {
    return [
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
            field: 'item_itmsGrpCod',
            headerName: 'Grupo',
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
            field: 'available',
            headerName: 'Stock',
            type: 'number',
            renderCell: ({ value }) => {
                return (
                    <Box style={{ fontWeight: 'bold' }} color='blue'>
                        {value}
                    </Box>
                )
            }
        },
    ]
}
