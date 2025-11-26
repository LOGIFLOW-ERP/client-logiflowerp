import { Chip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { OrderENTITY } from 'logiflowerp-sdk'

export const columnsOrder = (): GridColDef<OrderENTITY>[] => {
    return [
        {
            field: 'serial',
            headerName: 'Serie',
        },
        {
            field: 'stateSerial',
            headerName: 'Estado Serie',
            renderCell: ({ value }) => {
                return (
                    <Chip label={value} color='info' size='small' />
                )
            }
        }
    ]
}
