import { Box, Button, Typography } from '@mui/material'
import { useNavigate, useRouteError } from 'react-router-dom'

export function ErrorPage() {

    const error = useRouteError()
    const navigate = useNavigate()

    return (
        <Box
            display={'grid'}
            height={'100vh'}
            justifyItems={'center'}
            alignContent={'center'}
            rowGap={2}
            bgcolor={'#064199'}
            sx={{ color: 'white' }}
        >
            <Typography variant='h5'>Oops!</Typography>
            <Box
                display={'grid'}
                justifyItems={'center'}
            >
                <Typography variant='body1'>Lo sentimos 😢, se ha producido un error inesperado.</Typography>
                <Typography variant='body2'>
                    {(error as { statusText: string }).statusText || (error as Error).message}
                </Typography>
            </Box>
            <Button
                variant='outlined'
                onClick={() => navigate('/')}
                color='inherit'
            >
                Volver
            </Button>
        </Box>
    )
}