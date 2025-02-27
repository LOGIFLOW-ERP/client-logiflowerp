import { ReactNode } from 'react'
import { IconButton } from '@mui/material'
import { closeSnackbar, SnackbarProvider } from 'notistack'
import CloseIcon from '@mui/icons-material/Close'

interface SnackbarProviderProps {
    children: ReactNode
}

export const SnackbarProviderCustom = ({ children }: SnackbarProviderProps) => {
    return (
        <SnackbarProvider
            maxSnack={5}
            autoHideDuration={3000}
            action={(snackbarId) => (
                <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={() => closeSnackbar(snackbarId)}
                >
                    <CloseIcon fontSize='inherit' />
                </IconButton>
            )}
            disableWindowBlurListener
        >
            {children}
        </SnackbarProvider>
    )
}
