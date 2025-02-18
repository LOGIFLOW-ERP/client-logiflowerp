import { Box, Card, CardContent, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

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
                    {/* <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                        <img
                            src="/path-to-your-logo.png"  // Asegúrate de colocar la ruta correcta de tu logo
                            alt="Logo"
                            style={{ width: 100, height: 'auto' }}  // Ajusta el tamaño según lo necesites
                        />
                    </Box> */}
                    <Typography
                        variant='h5'
                        align='center'
                        gutterBottom
                    >
                        Iniciar sesión
                    </Typography>
                    <Outlet />
                </CardContent>
            </Card>
        </Box>
    )
}
