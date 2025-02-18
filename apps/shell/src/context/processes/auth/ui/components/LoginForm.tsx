import { Box, Button, Divider, Link, TextField } from '@mui/material';
import { useStore } from '@shared/ui/hooks';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {

    const { actions: { setState }, state } = useStore('auth')
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ [e.target.name]: e.target.value })
    }

    return (
        <form>
            <TextField
                label='Correo electrónico'
                variant='outlined'
                fullWidth
                margin='normal'
                autoFocus
                size='small'
                name='email'
                value={state.email}
                onChange={handleChange}
            />
            <TextField
                label='Contraseña'
                type='password'
                variant='outlined'
                fullWidth
                margin='normal'
                size='small'
                name='password'
                value={state.password}
                onChange={handleChange}
            />
            <Button
                variant='contained'
                color='primary'
                fullWidth
                sx={{ marginTop: 2 }}
            >
                Iniciar sesión
            </Button>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
                <Link
                    variant='body2'
                    color='primary'
                    sx={{ display: 'block', marginBottom: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/sign-up')}
                >
                    ¿No tienes cuenta? Regístrate
                </Link>
                <Link
                    variant='body2'
                    color='primary'
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/recover-password')}
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </Box>
        </form>
    )
}
