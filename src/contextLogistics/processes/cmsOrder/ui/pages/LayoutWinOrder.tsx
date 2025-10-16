import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { useGetCmsOrderPipelineQuery, useLazyGetCmsOrderPipelineQuery } from '@shared/infrastructure/redux/api'
import { CMSOrderENTITY } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { CustomToolbar, CustomViewError } from '@shared/ui/ui-library'
import { useGridApiRef } from '@mui/x-data-grid'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { Fallback } from '@app/ui/pages'
import { getMonthDateRange } from '@shared/utils/getMonthDateRange'
import { InputFileUploadOrder } from '../components/InputFileUploadOrder'

const CustomFilters = lazy(() => import('../components/CustomFilters').then(m => ({ default: m.CustomFilters })))
const InventoryDialog = lazy(() => import('../components/InventoryDialog').then(m => ({ default: m.InventoryDialog })))
const DireccionClienteDialog = lazy(() => import('../components/DireccionClienteDialog').then(m => ({ default: m.DireccionClienteDialog })))
const EstadosDialog = lazy(() => import('../components/EstadosDialog').then(m => ({ default: m.EstadosDialog })))
const hoy = new Date()
const { start, end } = getMonthDateRange(hoy.getMonth() + 1)

export default function LayoutCmsOrder() {
    const pipeline = [{ $match: { fin_visita: { $gte: start, $lt: end } } }]
    const { data, isError, error, isLoading } = useGetCmsOrderPipelineQuery(pipeline)
    const [fetchOrders, { data: pipelineData, isFetching: isFetchingPipeline, isError: isErrorPipeline, error: errorPipeline }] = useLazyGetCmsOrderPipelineQuery()
    const apiRef = useGridApiRef()
    const { enqueueSnackbar } = useSnackbar()
    const [openDireccionCliente, setOpenDireccionCliente] = useState(false)
    const [openInventory, setOpenInventory] = useState(false)
    const [openEstados, setOpenEstados] = useState(false)
    const [selectedRow, setSelectedRow] = useState<CMSOrderENTITY>()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [
        data,
        selectedRow,
        openInventory,
        pipelineData,
        openDireccionCliente,
        openEstados
    ])

    const onSubmitFilter = async (pipeline: any[]) => {
        await fetchOrders(pipeline).unwrap()
        enqueueSnackbar({ message: 'Reporte generado!', variant: 'success' })
    }

    const handleInventoryClick = (row: CMSOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenInventory(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleEstadosClick = (row: CMSOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenEstados(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleDireccionClienteClick = (row: CMSOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenDireccionCliente(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isError || isErrorPipeline) return <CustomViewError error={error ?? errorPipeline} />

    const rows = pipelineData ?? data ?? []

    return (
        <>
            <Box
                sx={{ height: { xs: '89vh', md: '86vh' }, width: '100%' }}
            >
                <DataGrid<CMSOrderENTITY>
                    rows={rows}
                    columns={columns({ handleInventoryClick, handleDireccionClienteClick, handleEstadosClick })}
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
                                customInputFileUpload1={<InputFileUploadOrder />}
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
            </Suspense>
        </>
    )
}