import { GridColDef } from '@mui/x-data-grid'
import { InventoryWinDTO } from 'logiflowerp-sdk'

export const columnsInventory = (): GridColDef<InventoryWinDTO>[] => {
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
