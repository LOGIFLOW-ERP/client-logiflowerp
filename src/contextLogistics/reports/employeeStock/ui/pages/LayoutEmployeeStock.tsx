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
import { useExportExcelEmployeeStock } from '../hooks/useExportExcel'

const EmployeeStockSerialDialog = lazy(() => import('../components/EmployeeStockSerialDialog').then(m => ({ default: m.EmployeeStockSerialDialog })))

export default function LayoutEmployeeStock() {

    const [openEmployeeStockSerialDialog, setOpenEmployeeStockSerialDialog] = useState(false)

    const [_selectedRow, setSelectedRow] = useState<EmployeeStockENTITYFlat>()

    const apiRef = useGridApiRef()
    const { enqueueSnackbar } = useSnackbar()
    const { exportExcelEmployeeStock, isLoadingExportExcel, isErrorExportExcel, errorExportExcel } = useExportExcelEmployeeStock()

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
        openEmployeeStockSerialDialog,
        isLoadingExportExcel
    ])

    const handleScannClick = (row: EmployeeStockENTITYFlat) => {
        try {
            setSelectedRow(row)
            setOpenEmployeeStockSerialDialog(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleExportExcelClick = async () => {
        try {
            await exportExcelEmployeeStock(apiRef, data ?? [])
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    if (isError || isErrorExportExcel) return <CustomViewError error={error ?? errorExportExcel} />

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
                        loading={isLoading || isLoadingExportExcel}
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
