import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { useGetToaOrderPipelineQuery, useLazyGetToaOrderPipelineQuery } from '@shared/infrastructure/redux/api'
import { TOAOrderENTITY } from 'logiflowerp-sdk'
import { columns } from '../GridCol'
import { CustomToolbar, CustomViewError } from '@shared/ui/ui-library'
import { useGridApiRef } from '@mui/x-data-grid'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { Fallback } from '@app/ui/pages'
import { getMonthDateRange } from '@shared/utils/getMonthDateRange'

const CustomFilters = lazy(() => import('../components/CustomFilters').then(m => ({ default: m.CustomFilters })))
const InventoryDialog = lazy(() => import('../components/InventoryDialog').then(m => ({ default: m.InventoryDialog })))
const ProductsServicesDialog = lazy(() => import('../components/ProductsServicesDialog').then(m => ({ default: m.ProductsServicesDialog })))
const hoy = new Date()
const { start, end } = getMonthDateRange(hoy.getMonth() + 1)

export default function LayoutToaOrder() {
    const pipeline = [{ $match: { settlement_date: { $gte: start, $lt: end } } }]
    const { data, isError, error, isLoading } = useGetToaOrderPipelineQuery(pipeline)
    const [fetchToaOrders, { data: pipelineData, isFetching: isFetchingPipeline, isError: isErrorPipeline, error: errorPipeline }] = useLazyGetToaOrderPipelineQuery()
    const apiRef = useGridApiRef()
    const { enqueueSnackbar } = useSnackbar()
    const [openProductsServices, setOpenProductsServices] = useState(false)
    const [openInventory, setOpenInventory] = useState(false)
    const [selectedRow, setSelectedRow] = useState<TOAOrderENTITY>()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [data, selectedRow, openInventory, pipelineData, openProductsServices])

    const onSubmitFilter = async (pipeline: any[]) => {
        await fetchToaOrders(pipeline).unwrap()
        enqueueSnackbar({ message: 'Reporte generado!', variant: 'success' })
    }

    const handleInventoryClick = (row: TOAOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenInventory(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleProductsServicesClick = (row: TOAOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenProductsServices(true)
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
                <DataGrid<TOAOrderENTITY>
                    rows={rows}
                    columns={columns({ handleInventoryClick, handleProductsServicesClick })}
                    disableRowSelectionOnClick
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
                    openProductsServices && (
                        <ProductsServicesDialog
                            open={openProductsServices}
                            setOpen={setOpenProductsServices}
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
            </Suspense>
        </>
    )
}