import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { OrderDetailENTITY, ProducType } from 'logiflowerp-sdk'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Box, Tooltip } from '@mui/material'
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';
import { CustomCellEdit } from '@shared/ui/ui-library';

interface IParams {
    handleDeleteClick: (row: OrderDetailENTITY) => void
    handleScannClick: (row: OrderDetailENTITY) => void
    handleAmoutClick: (row: OrderDetailENTITY) => void
    PUT_WAREHOUSE_EXIT_EDIT_AMOUNT_DETAIL_BY_ID: boolean
}

export const columnsDetail = (params: IParams): GridColDef<OrderDetailENTITY>[] => {
    const {
        handleScannClick,
        handleDeleteClick,
        handleAmoutClick,
        PUT_WAREHOUSE_EXIT_EDIT_AMOUNT_DETAIL_BY_ID
    } = params
    return [
        {
            field: 'position',
            headerName: 'Posición',
            type: 'number'
        },
        {
            field: 'itemCode',
            headerName: 'Código',
            valueGetter: (_value, row) => {
                return row.item.itemCode
            }
        },
        {
            field: 'itemName',
            headerName: 'Nombre',
            valueGetter: (_value, row) => {
                return row.item.itemName
            }
        },
        {
            field: 'uomCode',
            headerName: 'UM',
            valueGetter: (_value, row) => {
                return row.item.uomCode
            }
        },
        {
            field: 'producType',
            headerName: 'Tipo',
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
        },
        {
            field: 'price',
            headerName: 'Precio',
            type: 'number',
            valueGetter: (_value, row) => {
                return row.price.price
            }
        },
        {
            field: 'amount',
            headerName: 'Cantidad',
            type: 'number',
            renderCell: ({ value, row }) => {
                return (
                    <CustomCellEdit
                        value={value}
                        onClick={() => handleAmoutClick(row)}
                        showIcon={PUT_WAREHOUSE_EXIT_EDIT_AMOUNT_DETAIL_BY_ID}
                    />
                )
            }
        },
        {
            field: 'Acciones',
            type: 'actions',
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
