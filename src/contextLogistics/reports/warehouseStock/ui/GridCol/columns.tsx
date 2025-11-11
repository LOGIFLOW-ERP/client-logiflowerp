import { Box, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ProducType, WarehouseStockENTITYFlat } from 'logiflowerp-sdk';
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';



interface IParams {
    handleScannClick: (row: WarehouseStockENTITYFlat) => void
}

export const columns = (params: IParams): GridColDef<WarehouseStockENTITYFlat>[] => {
    const { handleScannClick } = params
    return [
        {
            field: 'stockType',
            headerName: 'Tipo Stock',
        },
        {
            field: 'store_company_code',
            headerName: 'Codigo Empresa',
        },
        {
            field: 'store_company_companyname',
            headerName: 'Nombre Empresa',
        },
        {
            field: 'store_code',
            headerName: 'Almacén',
        },
        {
            field: 'item_itemCode',
            headerName: 'Codigo Sap',
        },
        {
            field: 'item_itemName',
            headerName: 'Descripción',
        },
        {
            field: 'item_uomCode',
            headerName: 'UM',
        },
        {
            field: 'item_producType',
            headerName: 'SB',
            valueGetter: (_value, row) => {
                return row.item_producType
            },
            renderCell: ({ value, row }) => {
                if (value !== ProducType.SERIE) return value
                const colorMapping = {
                    0: '#FF0000',
                    [row.stock]: '#32CD32'
                }
                const color = colorMapping[row.stock] || '#FF8C00'
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <span>{value}</span>
                        <Tooltip title='Mostrar series' onClick={() => handleScannClick(row)}>
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
            field: 'incomeAmount',
            headerName: 'Ingreso',
        },
        {
            field: 'amountReturned',
            headerName: 'Devolución',
        },
        {
            field: 'ouputQuantity',
            headerName: 'Despacho',
        },
        {
            field: 'stock',
            headerName: 'Stock',
        }
    ]
}