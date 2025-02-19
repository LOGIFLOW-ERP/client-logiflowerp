import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"

export function VerifyEmail() {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'success' | 'error' | null>('error')

    useEffect(() => {
        console.log(token)
        if (!token) {
            setStatus('error')
            setLoading(false)
            return
        }
        // axios
        //     .post("/api/auth/verify-email", { token })
        //     .then(() => setStatus("success"))
        //     .catch(() => setStatus("error"))
        //     .finally(() => setLoading(false));
    }, [token])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center'
            }}
        >
            {loading && <CircularProgress />}
            {!loading && status === 'success' && (
                <>
                    <CheckCircleIcon color='success' sx={{ fontSize: 60 }} />
                    <Typography variant='h5' sx={{ mt: 2 }}>
                        ¡Correo verificado con éxito!
                    </Typography>
                    <Typography variant='body1' sx={{ mt: 1 }}>
                        Ahora puedes iniciar sesión en tu cuenta.
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        sx={{ mt: 3 }}
                        onClick={() => navigate('/sign-in')}
                    >
                        Ir a iniciar sesión
                    </Button>
                </>
            )}
            {!loading && status === 'error' && (
                <>
                    <ErrorIcon color='error' sx={{ fontSize: 60 }} />
                    <Typography variant='h5' sx={{ mt: 2 }}>
                        Error al verificar el correo
                    </Typography>
                    <Typography variant='body1' sx={{ mt: 1 }}>
                        El enlace no es válido o ha expirado.
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        sx={{ mt: 3 }}
                        onClick={() => navigate('/request-password-reset')}
                    >
                        Reenviar verificación
                    </Button>
                </>
            )}
        </Box>
    )
}
