import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { useGetWinOrderPipelineQuery, useLazyGetWinOrderPipelineQuery } from '@shared/infrastructure/redux/api'
import { WINOrderENTITY } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { CustomToolbar, CustomViewError } from '@shared/ui/ui-library'
import { useGridApiRef } from '@mui/x-data-grid'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { Fallback } from '@app/ui/pages'
import { getMonthDateRange } from '@shared/utils/getMonthDateRange'
import { useExportExcelWinOrder } from '../hooks/useExportExcel'

const CustomFilters = lazy(() => import('../components/CustomFilters').then(m => ({ default: m.CustomFilters })))
const InventoryDialog = lazy(() => import('../components/InventoryDialog').then(m => ({ default: m.InventoryDialog })))
const DireccionClienteDialog = lazy(() => import('../components/DireccionClienteDialog').then(m => ({ default: m.DireccionClienteDialog })))
const EstadosDialog = lazy(() => import('../components/EstadosDialog').then(m => ({ default: m.EstadosDialog })))
const EstadosInternoDialog = lazy(() => import('../components/EstadosInternoDialog').then(m => ({ default: m.EstadosInternoDialog })))
const hoy = new Date()
const { start, end } = getMonthDateRange(hoy.getMonth() + 1)

export default function LayoutWinOrder() {
    const pipeline = [{ $match: { fin_visita: { $gte: start, $lt: end } } }]
    const { data, isError, error, isLoading } = useGetWinOrderPipelineQuery(pipeline)
    const [fetchOrders, { data: pipelineData, isFetching: isFetchingPipeline, isError: isErrorPipeline, error: errorPipeline }] = useLazyGetWinOrderPipelineQuery()
    const apiRef = useGridApiRef()
    const { exportExcelWinOrder } = useExportExcelWinOrder()
    const { enqueueSnackbar } = useSnackbar()
    const [openDireccionCliente, setOpenDireccionCliente] = useState(false)
    const [openInventory, setOpenInventory] = useState(false)
    const [openEstados, setOpenEstados] = useState(false)
    const [openEstadosInterno, setOpenEstadosInterno] = useState(false)
    const [selectedRow, setSelectedRow] = useState<WINOrderENTITY>()
    const rows = pipelineData ?? data ?? []

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [
        rows,
        selectedRow,
        openInventory,
        pipelineData,
        openDireccionCliente,
        openEstados,
        isFetchingPipeline,
        openEstadosInterno
    ])

    const onSubmitFilter = async (pipeline: any[]) => {
        await fetchOrders(pipeline).unwrap()
        enqueueSnackbar({ message: 'Reporte generado!', variant: 'success' })
    }

    const handleInventoryClick = (row: WINOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenInventory(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleEstadosClick = (row: WINOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenEstados(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleEstadosInternoClick = (row: WINOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenEstadosInterno(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleDireccionClienteClick = (row: WINOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenDireccionCliente(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleExportExcelClick = () => {
        try {
            exportExcelWinOrder(apiRef, rows)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    if (isError || isErrorPipeline) return <CustomViewError error={error ?? errorPipeline} />

    return (
        <>
            <Box
                sx={{ height: { xs: '89vh', md: '86vh' }, width: '100%' }}
            >
                <DataGrid<WINOrderENTITY>
                    rows={rows}
                    columns={columns({
                        handleInventoryClick,
                        handleDireccionClienteClick,
                        handleEstadosClick,
                        handleEstadosInternoClick
                    })}
                    disableRowSelectionOnClick
                    sx={{
                        "& .MuiDataGrid-cell[data-field='estado']": {
                            padding: 0
                        }
                    }}
                    slots={{
                        toolbar: () => (
                            <CustomToolbar
                                AGREGAR_NUEVO_REGISTRO={false}
                                children={
                                    <CustomFilters
                                        onSubmitFilter={onSubmitFilter}
                                        isLoadingPipeline={isFetchingPipeline}
                                    />
                                }
                                handleExportExcelClick={handleExportExcelClick}
                            />
                        ),
                    }}
                    showToolbar
                    getRowId={row => row._id}
                    density='compact'
                    apiRef={apiRef}
                    loading={isLoading || isFetchingPipeline}
                />
            </Box>
            <Suspense fallback={<Fallback />}>
                {
                    openDireccionCliente && (
                        <DireccionClienteDialog
                            open={openDireccionCliente}
                            setOpen={setOpenDireccionCliente}
                            selectedRow={selectedRow!}
                        />
                    )
                }
                {
                    openInventory && (
                        <InventoryDialog
                            open={openInventory}
                            setOpen={setOpenInventory}
                            selectedRow={selectedRow!}
                        />
                    )
                }
                {
                    openEstados && (
                        <EstadosDialog
                            open={openEstados}
                            setOpen={setOpenEstados}
                            selectedRow={selectedRow!}
                        />
                    )
                }
                {
                    (openEstadosInterno && selectedRow) ? (
                        <EstadosInternoDialog
                            open={openEstadosInterno}
                            setOpen={setOpenEstadosInterno}
                            selectedRow={selectedRow}
                        />
                    ) : null
                }
            </Suspense>
        </>
    )
}