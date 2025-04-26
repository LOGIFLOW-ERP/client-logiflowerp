import { OrderDetailENTITY } from 'logiflowerp-sdk'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { columnsDetail } from '../GridCol'
import { useSnackbar } from 'notistack'
import { useDeleteDetailWarehouseEntryMutation } from '@shared/api'
import { lazy, useState } from 'react'
import { useStore } from '@shared/ui/hooks'
const SerialsDialog = lazy(() => import('./SerialsDialog').then(m => ({ default: m.SerialsDialog })))

export function DetalleTable() {

    const { setState, state: { selectedDetail, selectedDocument } } = useStore('warehouseEntry')

    const { enqueueSnackbar } = useSnackbar()
    const [deleteDetail, { isLoading: isLoadingDeleteDetail }] = useDeleteDetailWarehouseEntryMutation()
    const [open, setOpen] = useState(false)

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
            setState({ selectedDetail: row })
            setOpen(true)
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
                    columns={columnsDetail({ handleScannClick, handleDeleteClick })}
                    disableRowSelectionOnClick
                    getRowId={row => row.keyDetail}
                    loading={isLoadingDeleteDetail}
                    autoPageSize
                />
            </Box>
            {
                (selectedDetail && open) && (
                    <SerialsDialog
                        open={open}
                        setOpen={setOpen}
                    />
                )
            }
        </>
    )
}
