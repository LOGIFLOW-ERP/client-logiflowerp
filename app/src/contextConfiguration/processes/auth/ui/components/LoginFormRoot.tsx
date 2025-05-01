import { Button, CircularProgress, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { SignInRootDTO } from 'logiflowerp-sdk'
import { useSignInRootMutation } from '@shared/api'
import { useStore } from '@shared/ui/hooks'
import { useSnackbar } from 'notistack'

const resolver = classValidatorResolver(SignInRootDTO)

export function LoginFormRoot() {

    const navigate = useNavigate()
    const { setState } = useStore('auth')
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver })
    const [signIn, { isLoading }] = useSignInRootMutation()
    const { enqueueSnackbar } = useSnackbar()

    const onSubmit = async (data: SignInRootDTO) => {
        try {
            const {
                user,
                dataSystemOptions,
                company,
                profile,
                root,
                tags
            } = await signIn(data).unwrap()
            setState({
                isAuthenticated: true,
                user,
                dataSystemOptions,
                company,
                profile,
                root,
                tags
            })
            navigate('/')
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
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
        </form>
    )
}
