import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Box, Button, CircularProgress, Divider, Link, TextField } from '@mui/material'
import { useRequestPasswordResetMutation } from '@shared/api'
import { RequestPasswordResetDTO } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const resolver = classValidatorResolver(RequestPasswordResetDTO)

export function RequestPasswordResetForm() {

	const navigate = useNavigate()
	const { enqueueSnackbar } = useSnackbar()
	const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver })

	const onSubmit = async (data: RequestPasswordResetDTO) => {
		try {
			await requestPasswordReset(data).unwrap()
			enqueueSnackbar({
				message: '¡Solicitud enviada, por favor revice su correo electrónico!',
				variant: 'success'
			})
			navigate('/sign-in')
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
				margin='dense'
				size='small'
				{...register('email')}
				autoFocus
				error={!!errors.email}
				helperText={errors.email?.message}
			/>
			<Button
				variant='contained'
				color='primary'
				fullWidth
				sx={{ marginTop: 2 }}
				type='submit'
				disabled={isLoading}
			>
				{
					isLoading
						? <CircularProgress size={24} color='inherit' />
						: 'Enviar Solicitud'
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
					Iniciar sesión
				</Link>
			</Box>
		</form>
	)
}
