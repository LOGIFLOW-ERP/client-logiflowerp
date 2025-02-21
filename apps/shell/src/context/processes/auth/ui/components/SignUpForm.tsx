import { Box, Button, CircularProgress, Divider, Link, TextField } from '@mui/material'
import { CustomSelect } from '@shared/ui-library'
import { useNavigate } from 'react-router-dom'
import { dataCountry, State, getDataDocumentTypes, CreateUserDTO, DocumentType } from 'logiflowerp-sdk'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useSignUpMutation } from '@shared/api'
import { useSnackbar } from 'notistack'

const resolver = classValidatorResolver(CreateUserDTO)

export function SignUpForm() {

    const navigate = useNavigate()
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver, defaultValues: { country: 'PER', documentType: DocumentType.DNI } })
    const [signUp, { isLoading }] = useSignUpMutation()
    const { enqueueSnackbar } = useSnackbar()

    const onSubmit = async (data: CreateUserDTO) => {
        try {
            await signUp(data).unwrap()
            enqueueSnackbar({ message: '¡Registrado correctamente!', variant: 'success' })
            navigate('/sign-in')
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.error || '¡Ocurrió un error!', variant: 'error' })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name='country'
                control={control}
                render={({ field }) => (
                    <CustomSelect
                        label='País'
                        options={dataCountry.filter(e => e.estado === State.ACTIVO)}
                        {...field}
                        labelKey='nombre'
                        valueKey='alfa3'
                        margin='normal'
                        error={!!errors.country}
                        helperText={errors.country?.message}
                    />
                )}
            />
            <Controller
                name='documentType'
                control={control}
                render={({ field }) => (
                    <CustomSelect
                        label='Tipo de Documento'
                        options={getDataDocumentTypes()}
                        {...field}
                        labelKey='label'
                        valueKey='value'
                        margin='normal'
                        error={!!errors.documentType}
                        helperText={errors.documentType?.message}
                    />
                )}
            />
            <TextField
                label='ID'
                autoFocus
                variant='outlined'
                fullWidth
                margin='normal'
                size='small'
                {...register('identity')}
                error={!!errors.identity}
                helperText={errors.identity?.message}
            />
            <TextField
                label='Correo electrónico'
                variant='outlined'
                fullWidth
                margin='normal'
                size='small'
                autoComplete='email'
                {...register('email')}
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
                autoComplete='current-password'
                {...register('password')}
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
                        : 'Registrarse'
                }
            </Button>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
                <Link
                    variant='body2'
                    color='primary'
                    sx={{ display: 'block', marginBottom: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/sign-in')}
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </Link>
            </Box>
        </form>
    )
}
