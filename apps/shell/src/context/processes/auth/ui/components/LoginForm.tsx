import { Box, Button, CircularProgress, Divider, Link, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { LoginDTO } from 'logiflowerp-sdk'
import { useSignInMutation } from '@shared/api'
import { useStore } from '@shared/ui/hooks'

const resolver = classValidatorResolver(LoginDTO)

export function LoginForm() {

    const navigate = useNavigate()
    const { actions: { setState } } = useStore('auth')
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver })
    const [signIn, { isLoading }] = useSignInMutation()

    const onSubmit = async (data: LoginDTO) => {
        const result = await signIn(data)
        if ('error' in result) {
            console.error('Error al iniciar sesión:', result.error)
            return
        }
        setState({ isAuthenticated: true, user: result.data })
        navigate('/')
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label='Correo electrónico'
                variant='outlined'
                fullWidth
                margin='normal'
                autoFocus
                size='small'
                {...register('email')}
                autoComplete='email'
                error={!!errors.email}
                helperText={errors.email?.message}
            />
            <TextField
                label='Contraseña'
                type='password'
                variant='outlined'
                fullWidth
                margin='normal'
                size='small'
                {...register('password')}
                autoComplete='current-password'
                error={!!errors.password}
                helperText={errors.password?.message}
            />
            <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={isLoading}
            >
                {
                    isLoading
                        ? <CircularProgress size={24} color='inherit' />
                        : 'Iniciar sesión'
                }
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
                    onClick={() => navigate('/request-password-reset')}
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </Box>
        </form>
    )
}
