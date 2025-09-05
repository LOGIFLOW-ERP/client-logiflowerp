import { Box, Typography } from '@mui/material'

export function ErrorPageTenant() {
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
            </Box>
        </Box>
    )
}