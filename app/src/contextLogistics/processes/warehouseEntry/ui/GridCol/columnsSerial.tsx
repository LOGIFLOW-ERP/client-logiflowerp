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
            width: 100,
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
            field: 'producType',
            headerName: 'Tipo',
            width: 60,
            renderCell: ({ row }) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Tooltip title='Escanear series' onClick={() => handleDeleteClick(row)}>
                        <DeleteForeverRoundedIcon
                            cursor='pointer'
                            sx={{
                                color: '#2196f3',
                                alignSelf: 'center',
                                ml: '8px'
                            }}
                        />
                    </Tooltip>
                </Box>
            )
        },
    ]
}
