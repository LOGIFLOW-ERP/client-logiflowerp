import { Chip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { WarehouseStockSerialENTITY } from 'logiflowerp-sdk'

export const columnsWarehouseStockSerial = (): GridColDef<WarehouseStockSerialENTITY>[] => {
    return [
        {
            field: 'serial',
            headerName: 'Serie',
        },
        {
            field: 'brand',
            headerName: 'Marca',
        },
        {
            field: 'model',
            headerName: 'Modelo',
        },
        {
            field: 'state',
            headerName: 'Estado',
            renderCell: ({ value }) => {
                return (
                    <Chip label={value} color='success' size='small' />
                )
            }
        }
    ]
}
