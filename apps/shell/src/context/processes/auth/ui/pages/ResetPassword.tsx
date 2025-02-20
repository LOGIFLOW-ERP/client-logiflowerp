import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../../../../../assets/LogoSinMargen.webp'
import { ResetPasswordDTO } from 'logiflowerp-sdk'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useForm } from 'react-hook-form'

const resolver = classValidatorResolver(ResetPasswordDTO)

export function ResetPassword() {

    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: ResetPasswordDTO) => {
        if (!data.password || !data.confirmPassword) {
            setError('Ambos campos son obligatorios.')
            return
        }

        if (data.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.')
            return
        }

        if (data.password !== data.confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        try {
            setLoading(true)
            const response = await fetch('http://localhost:4000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: data.password }),
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
        } finally {
            setLoading(false)
        }
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

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Campo oculto para username (recomendado para compatibilidad con navegadores y gestores de contraseñas) */}
                <input type='text' name='username' autoComplete='username' hidden />
                <TextField
                    label='Nueva Contraseña'
                    type='password'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('password')}
                    autoComplete='new-password'
                    autoFocus
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <TextField
                    label='Confirmar Contraseña'
                    type='password'
                    fullWidth
                    margin='normal'
                    size='small'
                    autoComplete='new-password'
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {
                        loading
                            ? <CircularProgress size={24} color='inherit' />
                            : 'Restablecer'
                    }
                </Button>
            </form>
        </Box>
    )
}
