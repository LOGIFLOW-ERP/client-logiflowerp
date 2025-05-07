import { Box, Card, CardContent } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Logo from '/src/assets/logoSinMargen.webp'

export function LayoutAuth() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f2f5'
            }}
        >
            <Card sx={{ width: 400 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                        <img
                            src={Logo}
                            alt="Logo"
                            style={{ width: 125, height: 'auto' }}
                        />
                    </Box>
                    {/* <Typography
                        variant='h5'
                        align='center'
                        gutterBottom
                    >
                        Iniciar sesión
                    </Typography> */}
                    <Outlet />
                </CardContent>
            </Card>
        </Box>
    )
}
