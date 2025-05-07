import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { OrderDetailENTITY, ProducType } from 'logiflowerp-sdk'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Box, Tooltip } from '@mui/material'
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';

interface IParams {
    handleDeleteClick: (row: OrderDetailENTITY) => void
    handleScannClick: (row: OrderDetailENTITY) => void
}

export const columnsDetail = (params: IParams): GridColDef<OrderDetailENTITY>[] => {
    const { handleScannClick, handleDeleteClick } = params
    return [
        {
            field: 'position',
            headerName: 'Posición',
            width: 80,
            type: 'number'
        },
        {
            field: 'itemCode',
            headerName: 'Código',
            width: 105,
            valueGetter: (_value, row) => {
                return row.item.itemCode
            }
        },
        {
            field: 'itemName',
            headerName: 'Nombre',
            width: 300,
            valueGetter: (_value, row) => {
                return row.item.itemName
            }
        },
        {
            field: 'uomCode',
            headerName: 'UM',
            width: 80,
            valueGetter: (_value, row) => {
                return row.item.uomCode
            }
        },
        {
            field: 'producType',
            headerName: 'Tipo',
            width: 60,
            valueGetter: (_value, row) => {
                return row.item.producType
            },
            renderCell: ({ value, row }) => {
                if (value !== ProducType.SERIE) return value
                const colorMapping = {
                    0: '#FF0000',
                    [row.amount]: '#32CD32'
                }
                const color = colorMapping[row.serials.length] || '#FF8C00'
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <span>{value}</span>
                        <Tooltip title='Escanear series' onClick={() => handleScannClick(row)}>
                            <DocumentScannerRoundedIcon
                                cursor='pointer'
                                sx={{
                                    color,
                                    alignSelf: 'center',
                                    ml: '8px'
                                }}
                            />
                        </Tooltip>
                    </Box>
                )
            }
        },
        {
            field: 'lot',
            headerName: 'Lote',
            width: 100,
        },
        {
            field: 'price',
            headerName: 'Precio',
            width: 60,
            type: 'number',
            valueGetter: (_value, row) => {
                return row.price.price
            }
        },
        {
            field: 'amount',
            headerName: 'Cantidad',
            width: 75,
            type: 'number'
        },
        {
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteForeverRoundedIcon color='error' />}
                    label='Eliminar'
                    onClick={() => handleDeleteClick(params.row)}
                    showInMenu
                />,
            ],
        },
    ]
}
