import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import {
    useFinalizeLiquidationWINOrderMutation,
    useGetLiquidationWINOrdersQuery,
    useSendReviewWINOrderMutation
} from '@shared/infrastructure/redux/api'
import { WINOrderENTITY } from 'logiflowerp-sdk'
import { columns } from '../GridCol/columns'
import { CustomViewError } from '@shared/ui/ui-library'
import { useGridApiRef } from '@mui/x-data-grid'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { Fallback } from '@app/ui/pages'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'

const AddDialog = lazy(() => import('../components/AddDialog').then(m => ({ default: m.AddDialog })))
const InventoryDialog = lazy(() => import('../components/InventoryDialog').then(m => ({ default: m.InventoryDialog })))

export default function LayoutLiquidationOrder() {
    const { data, isError, error, isFetching } = useGetLiquidationWINOrdersQuery()
    const apiRef = useGridApiRef()
    const { enqueueSnackbar } = useSnackbar()
    const [openAdd, setOpenAdd] = useState(false)
    const [openInventory, setOpenInventory] = useState(false)
    const [selectedRow, setSelectedRow] = useState<WINOrderENTITY>()
    const [sendReview, { isLoading }] = useSendReviewWINOrderMutation()
    const [finalizeOrder, { isLoading: isFinalizing }] = useFinalizeLiquidationWINOrderMutation()
    const [
        PUT_LIQUIDATION_WIN_ORDER_ADD_INVENTORY_BY_ID,
    ] = usePermissions([
        PERMISSIONS.PUT_LIQUIDATION_WIN_ORDER_ADD_INVENTORY_BY_ID,
    ])

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
        if (selectedRow && data) {
            const row = data.find(e => e._id === selectedRow._id)
            if (row) {
                setSelectedRow(row)
            }
        }
    }, [data, selectedRow, openAdd, openInventory, isLoading, isFetching, isFinalizing])

    const handleLiquidationClick = (row: WINOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenAdd(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleInventoryClick = (row: WINOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenInventory(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleSendReviewClick = async (row: WINOrderENTITY) => {
        try {
            await sendReview(row._id).unwrap()
            enqueueSnackbar({ message: '¡Enviado a revisión!', variant: 'success' })
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleFinalizeOrderClick = async (row: WINOrderENTITY) => {
        try {
            await finalizeOrder(row._id).unwrap()
            enqueueSnackbar({ message: '¡Orden Finalizada!', variant: 'success' })
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError error={error} />

    return (
        <>
            <Box
                sx={{ height: { xs: '89vh', md: '86vh' }, width: '100%' }}
            >
                <DataGrid<WINOrderENTITY>
                    rows={data}
                    columns={columns({
                        handleLiquidationClick,
                        handleInventoryClick,
                        handleSendReviewClick,
                        handleFinalizeOrderClick,
                        PUT_LIQUIDATION_WIN_ORDER_ADD_INVENTORY_BY_ID
                    })}
                    disableRowSelectionOnClick
                    showToolbar
                    getRowId={row => row._id}
                    density='compact'
                    apiRef={apiRef}
                    loading={isFetching || isLoading || isFinalizing}
                />
            </Box>
            <Suspense fallback={<Fallback />}>
                {
                    openAdd && (
                        <AddDialog
                            open={openAdd}
                            setOpen={setOpenAdd}
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
                            loadingData={isFetching}
                        />
                    )
                }
            </Suspense>
        </>
    )
}