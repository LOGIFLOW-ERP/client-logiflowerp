import { Backdrop, Box, CircularProgress } from '@mui/material'
import Logo from '/src/assets/logoSinMargen.webp'

export function Fallback() {
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, display: 'grid', alignContent: 'center', justifyItems: 'center' })}
            open={true}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: 125, height: 'auto' }}
                />
            </Box>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}
