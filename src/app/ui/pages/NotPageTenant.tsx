import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Snackbar,
    Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export function NotPageTenant() {
    const [open, setOpen] = useState(false);
    const supportEmail = 'support@logiflowerp.com';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(supportEmail);
            setOpen(true);
        } catch (err) {
            console.error('No se pudo copiar el correo', err);
        }
    };

    return (
        <Box
            display="flex"
            height="100vh"
            justifyContent="center"
            alignItems="center"
            bgcolor="#064199"
            sx={{ color: 'white' }}
        >
            <Card
                sx={{
                    maxWidth: 550,
                    p: 3,
                    bgcolor: '#0A58CA',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: 6,
                    borderRadius: 3,
                }}
            >
                <CardContent>
                    <SupportAgentIcon sx={{ fontSize: 50, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                        🚫 ¡Ups! Dominio no registrado
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Parece que este dominio no está asociado a ninguna empresa.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Si crees que es un error, contacta con nuestro equipo de soporte:
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        }}
                        onClick={handleCopy}
                    >
                        <Typography variant="body1">{supportEmail}</Typography>
                        <IconButton size="small" sx={{ color: 'white' }}>
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    sx={{ width: '100%' }}
                    onClose={() => setOpen(false)}
                >
                    📋 ¡Correo copiado al portapapeles!
                </Alert>
            </Snackbar>
        </Box>
    );
}
