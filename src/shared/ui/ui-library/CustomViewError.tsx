import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface IProps {
    error?: FetchBaseQueryError | SerializedError
}

export function CustomViewError({ error }: IProps) {
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
                Ocurrió un problema. Por favor, inténtalo nuevamente o actualice la página. Si el problema continúa, contacta con Soporte.
                <br />
                {(error && 'status' in error) && <Typography variant='body1'>Error: {error.status}</Typography>}
                {(error && 'message' in error) && <Typography variant='body1'>Error: {error.message}</Typography>}
            </Alert>
        </Box>
    )
}
