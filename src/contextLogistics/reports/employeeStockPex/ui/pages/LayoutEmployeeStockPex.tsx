import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
    useReportEmployeeStockPexQuery,
    useUpdateEmployeeStockPexMutation
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { EmployeeStockPEXENTITYFlat } from 'logiflowerp-sdk'
import { getcolumns } from '../GridCol'

export default function LayoutEmployeeStock() {

    const [_openEdit, setOpenEdit] = useState(false)
    const [_selectedRow, setSelectedRow] = useState<EmployeeStockPEXENTITYFlat>()

    const { enqueueSnackbar } = useSnackbar()
    const pipeline = [{ $match: {} }]
    const { data, isLoading, isError } = useReportEmployeeStockPexQuery(pipeline)
    const [_updateIStore, { isLoading: isLoadingUpdate }] = useUpdateEmployeeStockPexMutation()


    const handleEditClick = (row: EmployeeStockPEXENTITYFlat) => {
        try {
            setSelectedRow(row)
            setOpenEdit(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError />

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid<EmployeeStockPEXENTITYFlat>
                rows={data}
                columns={getcolumns({
                    handleEditClick,
                    rows: data ?? [],
                    fieldsToInclude: [
                        'stockType',
                        'store_company_code',
                        'store_code',
                        "item_itemCode",
                        "item_itemName",
                        "item_uomCode",
                        "incomeAmount",
                        "amountReturned",
                        "ouputQuantity"
                    ], // solo estos campos
                    renameMap: {
                        stockType: 'Tipo',
                        store_company_code: 'Empresa',
                        store_code: 'Almacen',
                        item_itemCode: 'Código',
                        item_itemName: 'Nombre',
                        item_uomCode: 'UM',
                        incomeAmount: 'Ingreso',
                        amountReturned: 'Devolucion',
                        ouputQuantity: 'Despacho'
                    }
                })}
                disableRowSelectionOnClick
                getRowId={row => row._id}
                loading={isLoading || isLoadingUpdate}
            />
        </Box>
    )
}
