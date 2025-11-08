import { useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
    useReportEmployeeStockQuery,
    useUpdateEmployeeStockMutation
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { EmployeeStockENTITYFlat } from 'logiflowerp-sdk'
import { getcolumns } from '../GridCol'
import { columns_ } from '../GridCol/columns_'

export default function LayoutEmployeeStock() {

    const [_openEdit, setOpenEdit] = useState(false)
    const [_selectedRow, setSelectedRow] = useState<EmployeeStockENTITYFlat>()

    const { enqueueSnackbar } = useSnackbar()
    const pipeline = [{ $match: {} }]
    const { data, isLoading, isError, error } = useReportEmployeeStockQuery(pipeline)
    const [_updateIStore, { isLoading: isLoadingUpdate }] = useUpdateEmployeeStockMutation()
    const apiRef = useGridApiRef()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [
        data,
        isLoading
    ])

    const handleEditClick = (row: EmployeeStockENTITYFlat) => {
        try {
            setSelectedRow(row)
            setOpenEdit(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError error={error} />

    return (
        <Box sx={{ height: { xs: '89vh', md: '86vh' }, width: '100%' }}>
            <DataGrid<EmployeeStockENTITYFlat>
                rows={data}
                // columns={getcolumns({
                //     handleEditClick,
                //     rows: data ?? [],
                //     fieldsToInclude: [
                //         'stockType',
                //         'store_company_code',
                //         'employee_identity',
                //         'store_code',
                //         "item_itemCode",
                //         "item_itemName",
                //         "item_uomCode",
                //         'lot',
                //         "incomeAmount",
                //         "amountReturned",
                //         "ouputQuantity",
                //         "stock",
                //         'amountConsumed'
                //     ], // solo estos campos
                //     renameMap: {
                //         stockType: 'Tipo',
                //         store_company_code: 'Empresa',
                //         store_code: 'Almacen',
                //         item_itemCode: 'Código',
                //         item_itemName: 'Nombre',
                //         item_uomCode: 'UM',
                //         incomeAmount: 'Ingreso',
                //         amountReturned: 'Devolucion',
                //         ouputQuantity: 'Despacho',
                //         amountConsumed: 'Consumo',
                //         lot: 'Lote',
                //         employee_identity: 'Identificación'
                //     }
                // })}
                columns={columns_({})}
                disableRowSelectionOnClick
                getRowId={row => row._id}
                loading={isLoading || isLoadingUpdate}
                apiRef={apiRef}
                showToolbar
            />
        </Box>
    )
}
