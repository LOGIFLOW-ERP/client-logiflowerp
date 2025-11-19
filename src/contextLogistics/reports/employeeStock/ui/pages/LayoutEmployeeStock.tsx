import { lazy, Suspense, useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import {
    useReportEmployeeStockQuery,
} from '@shared/api'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { EmployeeStockENTITYFlat } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { Paper, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { Fallback } from '@app/ui/pages'
import { useExportExcel } from '@shared/ui/hooks'

const EmployeeStockSerialDialog = lazy(() => import('../components/EmployeeStockSerialDialog').then(m => ({ default: m.EmployeeStockSerialDialog })))

export default function LayoutEmployeeStock() {

    const [openEmployeeStockSerialDialog, setOpenEmployeeStockSerialDialog] = useState(false)

    const [_selectedRow, setSelectedRow] = useState<EmployeeStockENTITYFlat>()

    const apiRef = useGridApiRef()
    const { exportExcel, getCsvString } = useExportExcel()
    const { enqueueSnackbar } = useSnackbar()

    const pipeline = [{ $match: {} }]
    const { data, isLoading, isError, error } = useReportEmployeeStockQuery(pipeline)

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [
        data,
        isLoading,
        openEmployeeStockSerialDialog
    ])

    const handleScannClick = (row: EmployeeStockENTITYFlat) => {
        try {
            setSelectedRow(row)
            setOpenEmployeeStockSerialDialog(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleExportExcelClick = () => {
        try {
            const { csvString } = getCsvString(apiRef)
            exportExcel({
                filenamePrefix: 'Stock_Personal',
                data: [{ sheetName: 'StockPersonal', source: csvString }]
            })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError error={error} />

    return (
        <>
            <Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Stock Personal</Typography>
                </Box>
                <Box sx={{ height: '94%' }}>
                    <DataGrid<EmployeeStockENTITYFlat>
                        rows={data}
                        columns={columns({ handleScannClick })}
                        disableRowSelectionOnClick
                        showToolbar
                        getRowId={row => row._id}
                        loading={isLoading}
                        autoPageSize
                        density='compact'
                        apiRef={apiRef}
                        slots={{
                            toolbar: () => (
                                <CustomToolbar
                                    AGREGAR_NUEVO_REGISTRO={false}
                                    handleExportExcelClick={handleExportExcelClick}
                                />
                            )
                        }}
                    />
                </Box>
            </Paper>

            <Suspense fallback={<Fallback />}>
                {
                    (_selectedRow && openEmployeeStockSerialDialog) && (
                        <EmployeeStockSerialDialog
                            open={openEmployeeStockSerialDialog}
                            setOpen={setOpenEmployeeStockSerialDialog}
                            selectedRow={_selectedRow}
                        />
                    )
                }
            </Suspense>
        </>
    )
}
