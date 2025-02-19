import { Alert, Box, Button, TextField } from '@mui/material'
import { useStore } from '@shared/ui/hooks'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../../../../../assets/LogoSinMargen.webp'

export function ResetPassword() {

    const { actions: { setState }, state } = useStore('auth')
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()

    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!state.password || !state.confirmPassword) {
            setError('Ambos campos son obligatorios.')
            return
        }

        if (state.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.')
            return
        }

        if (state.password !== state.confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        try {
            const response = await fetch('http://localhost:4000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: state.password }),
            })

            if (!response.ok) throw new Error('Error al restablecer la contraseña.')

            setSuccess(true)
            setError('')

            setTimeout(() => {
                navigate('/sign-in')
            }, 3000)
        } catch (err) {
            console.log(err)
            setError('Hubo un problema. Inténtalo de nuevo.')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ [e.target.name]: e.target.value })
    }

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 5,
                p: 3,
                border: '1px solid #ccc',
                borderRadius: 2
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: 125, height: 'auto' }}
                />
            </Box>
            {/* <Typography variant='h6' gutterBottom>
                Restablecer Contraseña
            </Typography> */}
            {error && <Alert severity='error'>{error}</Alert>}
            {success && <Alert severity='success'>Contraseña restablecida correctamente.</Alert>}

            <form onSubmit={handleSubmit}>
                {/* Campo oculto para username (recomendado para compatibilidad con navegadores y gestores de contraseñas) */}
                <input type='text' name='username' autoComplete='username' hidden />
                <TextField
                    label='Nueva Contraseña'
                    type='password'
                    fullWidth
                    margin='normal'
                    size='small'
                    value={state.password}
                    name='password'
                    onChange={handleChange}
                    autoComplete='new-password'
                    autoFocus
                />
                <TextField
                    label='Confirmar Contraseña'
                    type='password'
                    fullWidth
                    margin='normal'
                    size='small'
                    value={state.confirmPassword}
                    onChange={handleChange}
                    autoComplete='new-password'
                    name='confirmPassword'
                />
                <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 2 }}>
                    Restablecer
                </Button>
            </form>
        </Box>
    )
}
