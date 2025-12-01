import { Box, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { InventoryWinDTO } from 'logiflowerp-sdk'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'

interface IParams {
    handleDeleteClick: (row: InventoryWinDTO) => void
}

export const columnsInventory = ({ handleDeleteClick }: IParams): GridColDef<InventoryWinDTO>[] => {
    return [
        {
            field: 'Acciones',
            type: 'actions',
            width: 60,
            renderCell: ({ row }) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '100%'
                    }}
                >
                    <Tooltip title='Eliminar inventario' onClick={() => handleDeleteClick(row)}>
                        <DeleteForeverRoundedIcon
                            cursor='pointer'
                            sx={{
                                color: '#FF0000',
                                alignSelf: 'center',
                            }}
                        />
                    </Tooltip>
                </Box>
            )
        },
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
            headerName: 'Cant',
            type: 'number',
        },
        {
            field: 'invsn',
            headerName: 'Serie',
        },
    ]
}
