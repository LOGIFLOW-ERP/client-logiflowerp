import { GridColDef } from '@mui/x-data-grid'
import { InventoryToaDTO } from 'logiflowerp-sdk'

export const columnsInventory = (): GridColDef<InventoryToaDTO>[] => {
    return [
        {
            field: 'code',
            headerName: 'Código',
        },
        {
            field: 'description',
            headerName: 'Descripción',
        },
        {
            field: 'quantity',
            headerName: 'Cantidad',
            type: 'number',
        },
        {
            field: 'invsn',
            headerName: 'Serie',
        },
    ]
}
