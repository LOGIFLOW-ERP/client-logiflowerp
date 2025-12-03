import { CustomDialog } from '@shared/ui/ui-library'
import { useEffect, useState } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useSocketContext, useSocketEvent } from '@shared/infrastructure/socket'
import { WarehouseExitENTITY } from 'logiflowerp-sdk'

export function TechApprovalWarehouseExit() {
    const [open, setOpen] = useState(false)
    const [document, setDocument] = useState<WarehouseExitENTITY | null>(null)
    const [requesterId, setRequesterId] = useState<string | null>(null)
    const { socket } = useSocketContext()

    const [secondsLeft, setSecondsLeft] = useState(30)
    const { enqueueSnackbar } = useSnackbar()

    useSocketEvent('warehouseExit:techApprovalRequest', (data) => {
        setDocument(data.document)
        setRequesterId(data.requesterId)
        setSecondsLeft(30)
        setOpen(true)
    })

    useEffect(() => {
        if (!open) return

        if (secondsLeft <= 0 && document && requesterId) {
            enqueueSnackbar({
                message: 'Tiempo agotado, rechazado automáticamente.',
                variant: 'warning'
            })

            socket.emit('warehouseExit:techApprovalSubmit', {
                approved: false,
                document,
                requesterId
            })
            setOpen(false)
            return
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [open, secondsLeft, document, requesterId])

    const approve = () => {
        try {
            if (!document || !requesterId) {
                throw new Error('Documento o solicitante no encontrado')
            }
            socket.emit('warehouseExit:techApprovalSubmit', {
                approved: true,
                document,
                requesterId
            })
            setOpen(false)
            enqueueSnackbar({
                message: 'Aprobado exitosamente.',
                variant: 'success'
            })
        } catch (error) {
            enqueueSnackbar({
                message: (error as Error).message,
                variant: 'error'
            })
        }
    }

    const reject = () => {
        try {
            if (!document || !requesterId) {
                throw new Error('Documento o solicitante no encontrado')
            }
            socket.emit('warehouseExit:techApprovalSubmit', {
                approved: false,
                document,
                requesterId
            })
            setOpen(false)
            enqueueSnackbar({
                message: 'Rechazado exitosamente.',
                variant: 'success'
            })
        } catch (error) {
            enqueueSnackbar({
                message: (error as Error).message,
                variant: 'error'
            })
        }
    }

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Firmar salida almacén'
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: 2 }}>
                <Typography variant='caption'>N° documento: {document?.documentNumber}</Typography>
                <Typography variant='caption'>Fecha Solicitud: {new Date(document?.workflow?.register?.date ?? 0).toLocaleString()}</Typography>
                <Typography variant='caption'>Almacén: {document?.store?.code} - {document?.store?.name}</Typography>
                <Alert severity='warning'>
                    Debes responder antes de <strong>{secondsLeft}</strong> segundos.
                </Alert>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, padding: 1 }}>
                <Button
                    size='medium'
                    color='error'
                    onClick={reject}
                    variant='outlined'
                    fullWidth
                >
                    Rechazar
                </Button>
                <Button
                    size='medium'
                    color='success'
                    onClick={approve}
                    variant='contained'
                    fullWidth
                >
                    Aprobar
                </Button>
            </Box>
        </CustomDialog>
    )
}