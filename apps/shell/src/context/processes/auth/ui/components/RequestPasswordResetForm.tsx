import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Box, Button, CircularProgress, Divider, Link, TextField } from '@mui/material'
import { RequestPasswordResetDTO } from 'logiflowerp-sdk'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const resolver = classValidatorResolver(RequestPasswordResetDTO)

export function RequestPasswordResetForm() {

	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver })

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
				disabled={loading}
			>
				{
					loading
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
