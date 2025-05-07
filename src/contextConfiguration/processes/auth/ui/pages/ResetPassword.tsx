import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ResetPasswordDTO } from 'logiflowerp-sdk'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useForm } from 'react-hook-form'
import { useResetPasswordMutation } from '@shared/api'
import { useState } from 'react'
import Logo from '/src/assets/logoSinMargen.webp';

const resolver = classValidatorResolver(ResetPasswordDTO)

export function ResetPassword() {

    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver, defaultValues: { token: token ?? '' } })
    const [resetPassword, { isLoading, isError, isSuccess }] = useResetPasswordMutation()
    const [error, setError] = useState('')

    const onSubmit = async (data: ResetPasswordDTO) => {
        try {
            if (data.password !== data.confirmPassword) {
                setError('Las contraseñas no coinciden.')
                return
            }
            setError('')
            await resetPassword(data).unwrap()
            setTimeout(() => {
                navigate('/sign-in')
            }, 2500)
        } catch (error: any) {
            setError(error.message)
            console.error(error)
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 2,
                    cursor: 'pointer'
                }}
                onClick={() => { navigate('/sign-in') }}
            >
                <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: 125, height: 'auto' }}
                />
            </Box>
            {(isError || error) && <Alert severity='error'>{error ?? 'Hubo un problema. Inténtalo de nuevo.'}</Alert>}
            {isSuccess && <Alert severity='success'>Contraseña restablecida. Redirigiendo ...</Alert>}

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
                    disabled={isLoading}
                >
                    {
                        isLoading
                            ? <CircularProgress size={24} color='inherit' />
                            : 'Restablecer'
                    }
                </Button>
            </form>
        </Box>
    )
}
