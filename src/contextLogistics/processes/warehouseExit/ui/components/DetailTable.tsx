import { OrderDetailENTITY } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { columnsDetail } from '../GridCol'
import { useSnackbar } from 'notistack'
import { useDeleteDetailWarehouseExitMutation, useEditAmountDetailWarehouseExitMutation } from '@shared/api'
import { lazy, Suspense, useEffect, useState } from 'react'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const SerialsDialog = lazy(() => import('./SerialsDialog').then(m => ({ default: m.SerialsDialog })))
const EditAmountDetailDialog = lazy(() => import('./EditAmountDetailDialog').then(m => ({ default: m.EditAmountDetailDialog })))

export function DetailTable() {

    const { setState, state: { selectedDetail, selectedDocument } } = useStore('warehouseExit')

    const { enqueueSnackbar } = useSnackbar()
    const [deleteDetail, { isLoading: isLoadingDeleteDetail }] = useDeleteDetailWarehouseExitMutation()
    const [editAmountDetail, { isLoading: isLoadingEditAmountDetail }] = useEditAmountDetailWarehouseExitMutation()
    const [open, setOpen] = useState(false)
    const [openEditAmountDetailDialog, setOpenEditAmountDetailDialog] = useState(false)
    const [
        canWarehouseExitAddSerialByID,
        canWarehouseExitDeleteDetailByID
    ] = usePermissions([
        PERMISSIONS.PUT_WAREHOUSE_EXIT_ADD_SERIAL_BY_ID,
        PERMISSIONS.PUT_WAREHOUSE_EXIT_DELETE_DETAIL_BY_ID
    ])
    const apiRef = useGridApiRef()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [
        open,
        openEditAmountDetailDialog,
        setState
    ])

    const handleDeleteClick = async (row: OrderDetailENTITY) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            const document = await deleteDetail({ _id: selectedDocument._id, keyDetail: row.keyDetail }).unwrap()
            setState({ selectedDocument: document })
            enqueueSnackbar({ message: '¡Detalle eliminado!', variant: 'success' })
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleScannClick = (row: OrderDetailENTITY) => {
        try {
            if (!canWarehouseExitAddSerialByID) {
                throw new Error(`¡Sin permisos para realizar esta acción!`)
            }
            setState({ selectedDetail: row })
            setOpen(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleAmoutClick = (row: OrderDetailENTITY) => {
        try {
            if (!canWarehouseExitAddSerialByID) {
                throw new Error(`¡Sin permisos para realizar esta acción!`)
            }
            setState({ selectedDetail: row })
            setOpenEditAmountDetailDialog(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <>
            <Box sx={{ height: '100%' }}>
                <DataGrid<OrderDetailENTITY>
                    rows={selectedDocument?.detail}
                    columns={columnsDetail({ handleScannClick, handleDeleteClick, handleAmoutClick })}
                    disableRowSelectionOnClick
                    getRowId={row => row.keyDetail}
                    loading={isLoadingDeleteDetail || isLoadingEditAmountDetail}
                    autoPageSize
                    columnVisibilityModel={{
                        actions: canWarehouseExitDeleteDetailByID
                    }}
                    apiRef={apiRef}
                />
            </Box>
            <Suspense fallback={<Fallback />}>
                {
                    (selectedDetail && open) && (
                        <SerialsDialog
                            open={open}
                            setOpen={setOpen}
                        />
                    )
                }
                {
                    (selectedDetail && openEditAmountDetailDialog) && (
                        <EditAmountDetailDialog
                            open={openEditAmountDetailDialog}
                            setOpen={setOpenEditAmountDetailDialog}
                            editAmountDetail={editAmountDetail}
                            isLoading={isLoadingEditAmountDetail}
                        />
                    )
                }
            </Suspense>
        </>
    )
}
