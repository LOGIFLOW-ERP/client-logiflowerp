import { Box, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ProductGroupENTITY, ProducType, WarehouseStockENTITYFlat } from 'logiflowerp-sdk';
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';



interface IParams {
    handleScannClick: (row: WarehouseStockENTITYFlat) => void
    dataProductGroups: ProductGroupENTITY[]
}

export const columns = (params: IParams): GridColDef<WarehouseStockENTITYFlat>[] => {
    const { handleScannClick, dataProductGroups } = params
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
            field: 'nameGroup',
            headerName: 'Grupo',
            renderCell: ({ row }) => {
                const productGroup = dataProductGroups.find(productGroup => productGroup.itmsGrpCod === row.item_itmsGrpCod)
                return productGroup?.itmsGrpNam ?? 'N/A'
            }
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