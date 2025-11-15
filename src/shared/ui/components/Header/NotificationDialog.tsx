import React from 'react';
import {
    Typography,
    Box,
} from '@mui/material';
import { CustomDialog } from '@shared/ui-library';
import { NotificationENTITY, TypeNotification } from 'logiflowerp-sdk';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DangerousIcon from '@mui/icons-material/Dangerous'
import InfoIcon from '@mui/icons-material/Info'

interface IProps {
    open: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>
    notification: NotificationENTITY
}

export const NotificationDialog = ({ open, onClose, notification }: IProps) => {
    let Icon = <InfoIcon fontSize='small' color='info' />
    switch (notification.tipo) {
        case TypeNotification.ERROR:
            Icon = <DangerousIcon fontSize='small' color='error' />
            break
        case TypeNotification.SUCCESS:
            Icon = <CheckCircleIcon fontSize='small' color='success' />
            break
    }

    return (
        <CustomDialog
            open={open}
            setOpen={onClose}
            title='Notificación 🔔'
        >
            <Box component='div' style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Box width='100%'>
                    <Typography variant='body1' color='text.primary' display='flex' alignItems='center' gap={1}>
                        {Icon}{notification.titulo}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' display='flex' alignItems='center' gap={1}>
                        {notification.mensaje}
                    </Typography>
                </Box>
                <Box width='100%'>
                    <Typography variant='body2' color='text.secondary' mt={1}>
                        {new Date(notification.fechaCreacion).toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </CustomDialog>
    )
}
