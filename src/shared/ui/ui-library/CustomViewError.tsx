import { Alert, Box, } from '@mui/material'
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
                {error && 'Error: ' + (error as FetchBaseQueryError).status}
                {error && 'Error: ' + (error as SerializedError).message}
            </Alert>
        </Box>
    )
}
