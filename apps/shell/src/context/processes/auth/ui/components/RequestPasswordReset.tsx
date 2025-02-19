import { Box, Button, Divider, Link, TextField } from '@mui/material';
import { useStore } from '@shared/ui/hooks';
import { useNavigate } from 'react-router-dom';

export function RequestPasswordReset() {

	const { actions: { setState }, state } = useStore('auth')
	const navigate = useNavigate()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setState({ [e.target.name]: e.target.value })
	}

	return (
		<form>
			<TextField
				label='Correo electrónico'
				variant='outlined'
				fullWidth
				margin='dense'
				size='small'
				onChange={handleChange}
				name='email'
				value={state.email}
				autoFocus
			/>
			<Button
				variant='contained'
				color='primary'
				fullWidth
				sx={{ marginTop: 2 }}
			>
				Enviar Solicitud
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
