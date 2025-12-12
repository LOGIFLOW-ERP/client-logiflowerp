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
            type: 'dateTime',
            valueGetter: (value) => new Date(value),
            valueFormatter: (params: Date) => {
                return params.toLocaleString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })
            }
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
