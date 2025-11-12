import { Box, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ProducType, EmployeeStockENTITYFlat } from 'logiflowerp-sdk';
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';



interface IParams {
    handleScannClick: (row: EmployeeStockENTITYFlat) => void
}

export const columns = (params: IParams): GridColDef<EmployeeStockENTITYFlat>[] => {
    const { handleScannClick } = params
    return [
        {
            field: 'stockType',
            headerName: 'Tipo',
        },
        {
            field: 'store_company_code',
            headerName: 'Empresa',
        },
        {
            field: 'store_code',
            headerName: 'Almacén',
        },
        {
            field: 'employee_identity',
            headerName: 'Identificación',
        },
        {
            field: 'personal',
            headerName: 'Personal',
            valueGetter: (_value, row) => {
                return `${row.employee_names} ${row.employee_surnames}`
            }
        },
        {
            field: 'item_itemCode',
            headerName: 'Código',
        },
        {
            field: 'item_itemName',
            headerName: 'Nombre',
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
            type: 'number'
        },
        {
            field: 'amountReturned',
            headerName: 'Devolución',
            type: 'number'
        },
        {
            field: 'amountConsumed',
            headerName: 'Consumo',
            type: 'number'
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number'
        },
    ]
}