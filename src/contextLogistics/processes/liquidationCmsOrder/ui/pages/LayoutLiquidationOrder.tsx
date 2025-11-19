import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { useGetLiquidationWINOrdersQuery } from '@shared/infrastructure/redux/api'
import { TOAOrderENTITY } from 'logiflowerp-sdk'
import { columns } from '../GridCol'
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
    const { data, isError, error, isLoading } = useGetLiquidationWINOrdersQuery()
    const apiRef = useGridApiRef()
    const { enqueueSnackbar } = useSnackbar()
    const [openAdd, setOpenAdd] = useState(false)
    const [openInventory, setOpenInventory] = useState(false)
    const [selectedRow, setSelectedRow] = useState<TOAOrderENTITY>()
    const [
        PUT_LIQUIDATION_CMS_ORDER_ADD_INVENTORY_BY_ID,
    ] = usePermissions([
        PERMISSIONS.PUT_LIQUIDATION_CMS_ORDER_ADD_INVENTORY_BY_ID,

    ])

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [data, selectedRow, openAdd, openInventory])

    const handleLiquidationClick = (row: TOAOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenAdd(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleInventoryClick = (row: TOAOrderENTITY) => {
        try {
            setSelectedRow(row)
            setOpenInventory(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError error={error} />

    return (
        <>
            <Box
                sx={{ height: { xs: '89vh', md: '86vh' }, width: '100%' }}
            >
                <DataGrid<TOAOrderENTITY>
                    rows={[]}
                    // columns={columns({ handleChangeStatusClick, handleEditClick, PUT_PRODUCT_BY_ID, dataProductGroups })}
                    columns={columns({
                        handleLiquidationClick,
                        handleInventoryClick,
                        PUT_LIQUIDATION_CMS_ORDER_ADD_INVENTORY_BY_ID
                    })}
                    disableRowSelectionOnClick
                    // slots={{
                    //     toolbar: () => (
                    //         <CustomToolbar
                    //             setOpenAdd={setOpenAdd}
                    //             AGREGAR_NUEVO_REGISTRO={POST_PRODUCT}
                    //             children={<CustomFilters fetchProducts={fetchProducts} />}
                    //         />
                    //     ),
                    // }}
                    showToolbar
                    getRowId={row => row._id}
                    density='compact'
                    apiRef={apiRef}
                    loading={isLoading}
                // error={isError}
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
                        />
                    )
                }
            </Suspense>
        </>
    )
}