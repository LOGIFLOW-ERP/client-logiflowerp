import { Box, Button, CircularProgress, Divider, Link, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { SignInDTO } from 'logiflowerp-sdk'
import { useGetActiveRootCompaniesQuery, useSignInMutation } from '@shared/api'
import { useStore } from '@shared/ui/hooks'
import { useSnackbar } from 'notistack'
import { CustomSelect, CustomViewError, CustomViewLoading } from '@shared/ui-library'

const resolver = classValidatorResolver(SignInDTO)

export function LoginForm() {

    const navigate = useNavigate()
    const { actions: { setState } } = useStore('auth')
    const companyCode = localStorage.getItem('companyCode') ?? ''
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm({ resolver, defaultValues: { companyCode } })
    const [signIn, { isLoading }] = useSignInMutation()
    const { data: dataRootCompanies, error: errorRootCompanies, isLoading: isLoadingRootCompanies } = useGetActiveRootCompaniesQuery()
    const { enqueueSnackbar } = useSnackbar()

    const onSubmit = async (data: SignInDTO) => {
        try {
            localStorage.setItem('companyCode', data.companyCode)
            const { user, dataSystemOptions } = await signIn(data).unwrap()
            setState({ isAuthenticated: true, user, dataSystemOptions })
            navigate('/')
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isLoadingRootCompanies) return <CustomViewLoading />
    if (errorRootCompanies) return <CustomViewError />

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name='companyCode'
                control={control}
                render={({ field }) => (
                    <CustomSelect
                        label='Empresa'
                        options={dataRootCompanies ?? []}
                        {...field}
                        labelKey='companyname'
                        valueKey='code'
                        margin='normal'
                        error={!!errors.companyCode}
                        helperText={errors.companyCode?.message}
                    />
                )}
            />
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
