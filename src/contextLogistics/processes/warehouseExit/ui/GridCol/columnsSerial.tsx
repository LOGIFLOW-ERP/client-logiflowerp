import { GridColDef } from '@mui/x-data-grid'
import { StockSerialDTO } from 'logiflowerp-sdk'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Box, Tooltip } from '@mui/material'

interface IParams {
    handleDeleteClick: (row: StockSerialDTO) => void
}

export const columnsSerial = (params: IParams): GridColDef<StockSerialDTO>[] => {
    const { handleDeleteClick } = params
    return [
        {
            field: 'serial',
            headerName: 'Serie',
            width: 200,
        },
        {
            field: 'brand',
            headerName: 'Marca',
            width: 100,
        },
        {
            field: 'model',
            headerName: 'Modelo',
            width: 100,
        },
        {
            field: 'actions',
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
                    <Tooltip title='Eliminar serie' onClick={() => handleDeleteClick(row)}>
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
    ]
}
