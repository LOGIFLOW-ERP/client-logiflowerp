import { Box, Typography } from '@mui/material'
import Logo from '/src/assets/logoSinMargen.webp'

export function Fallback() {
    return (
        <Box
            sx={{
                display: 'grid',
                height: '100vh',
                alignContent: 'center',
                justifyItems: 'center'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: 125, height: 'auto' }}
                />
            </Box>
            <Typography variant='body1'>Cargando ...</Typography>
        </Box>
    )
}
