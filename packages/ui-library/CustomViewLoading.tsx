import { Box, CircularProgress, Typography } from '@mui/material'

export function CustomViewLoading() {
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
            }}
        >
            <CircularProgress size={30} />
            <Typography variant='h6' sx={{ marginTop: '1rem' }}>
                Cargando...
            </Typography>
        </Box>
    );
}
