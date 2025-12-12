import { Chip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { EmployeeStockSerialENTITY } from 'logiflowerp-sdk'

export const columnsEmployeeStockSerial = (): GridColDef<EmployeeStockSerialENTITY>[] => {
    return [
        {
            field: 'serial',
            headerName: 'Serie',
        },
         {
            field: 'updatedate',
            headerName: 'F. Estado',
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
