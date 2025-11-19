import { OrderDetailENTITY } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { columnsDetail } from '../GridCol/columnsDetail'
import { useSnackbar } from 'notistack'
import { useDeleteDetailWarehouseEntryMutation } from '@shared/api'
import { lazy, Suspense, useEffect, useState } from 'react'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const SerialsDialog = lazy(() => import('./SerialsDialog').then(m => ({ default: m.SerialsDialog })))

interface IProps {
    isFetching: boolean
}

export function DetalleTable({ isFetching }: IProps) {

    const { setState, state: { selectedDetail, selectedDocument } } = useStore('warehouseEntry')

    const { enqueueSnackbar } = useSnackbar()
    const [deleteDetail, { isLoading: isLoadingDeleteDetail }] = useDeleteDetailWarehouseEntryMutation()
    const [open, setOpen] = useState(false)
    const [
        canWarehouseEntryAddSerialByID,
        canWarehouseEntryDeleteDetailByID
    ] = usePermissions([
        PERMISSIONS.PUT_WAREHOUSE_ENTRY_ADD_SERIAL_BY_ID,
        PERMISSIONS.PUT_WAREHOUSE_ENTRY_DELETE_DETAIL_BY_ID
    ])
    const apiRef = useGridApiRef()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
            disableColumnVirtualization: true
        })
    }, [open, isFetching])

    const handleDeleteClick = async (row: OrderDetailENTITY) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            await deleteDetail({ _id: selectedDocument._id, keyDetail: row.keyDetail }).unwrap()
            enqueueSnackbar({ message: '¡Detalle eliminado!', variant: 'success' })
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleScannClick = (row: OrderDetailENTITY) => {
        try {
            if (!canWarehouseEntryAddSerialByID) {
                throw new Error(`¡Sin permisos para realizar esta acción!`)
            }
            setState({ selectedDetail: row })
            setOpen(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <>
            <Box>
                <DataGrid<OrderDetailENTITY>
                    rows={selectedDocument?.detail}
                    columns={columnsDetail({ handleScannClick, handleDeleteClick })}
                    disableRowSelectionOnClick
                    getRowId={row => row.keyDetail}
                    loading={isLoadingDeleteDetail || isFetching}
                    autoPageSize={false}
                    columnVisibilityModel={{
                        actions: canWarehouseEntryDeleteDetailByID
                    }}
                    apiRef={apiRef}
                    pageSizeOptions={[10]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                />
            </Box>
            <Suspense fallback={<Fallback />}>
                {
                    (selectedDetail && open) && (
                        <SerialsDialog
                            open={open}
                            setOpen={setOpen}
                            isFetching={isFetching}
                        />
                    )
                }
            </Suspense>
        </>
    )
}
