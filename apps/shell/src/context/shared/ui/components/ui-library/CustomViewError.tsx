import { Alert, Box, } from '@mui/material'

export function CustomViewError() {
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '3rem'
            }}
        >
            <Alert severity='error'>
                Ocurrió un problema. Por favor, inténtalo nuevamente. Si el problema continúa, contacta con Soporte.
            </Alert>
        </Box>
    )
}
