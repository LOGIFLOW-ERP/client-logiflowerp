import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    title: React.ReactNode
    description: React.ReactNode
    handleConfirmDialog: () => void
}

export function CustomConfirmationDialog(props: IProps) {
    const { open, setOpen, title, description, handleConfirmDialog } = props

    const handleClose = () => {
        setOpen(false)
    }

    const handleConfirm = () => {
        setOpen(false)
        handleConfirmDialog()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button
                    onClick={handleConfirm}
                    autoFocus
                >
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
