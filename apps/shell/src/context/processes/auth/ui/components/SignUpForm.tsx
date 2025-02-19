import { Box, Button, CircularProgress, Divider, Link, TextField } from '@mui/material'
import { CustomSelect } from '@shared/ui-library'
import { useNavigate } from 'react-router-dom'
import { dataCountry, State, getDataDocumentTypes } from 'logiflowerp-sdk'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'

const schema = yup.object().shape({
    country: yup.string().required('País es obligatorio'),
    documentType: yup.string().required('Tipo de Documento es obligatorio'),
    identity: yup
        .string()
        .min(8, 'ID debe tener al menos 8 caracteres')
        .max(9, 'ID debe tener máximo 9 caracteres')
        .required('ID es obligatorio'),
    email: yup.string().email('Correo electrónico no válido').required('El correo es obligatorio'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
})

export function SignUpForm() {

    const navigate = useNavigate()
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema), defaultValues: { country: '', documentType: '' } })
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: any) => {
        setLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log('Datos enviados:', data)
        } catch (error) {
            console.error('Error al iniciar sesión:', error)
        } finally {
            setLoading(false)
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
                disabled={loading}
            >
                {
                    loading
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
