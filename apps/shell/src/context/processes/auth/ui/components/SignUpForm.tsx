import { Box, Button, Divider, Link, TextField } from '@mui/material'
import { CustomSelect } from '@shared/ui-library'
import { useStore } from '@shared/ui/hooks'
import { useNavigate } from 'react-router-dom'
// import { dataCountry, State } from 'logiflowerp-sdk'

export function SignUpForm() {

    const { actions: { setState }, state } = useStore('auth')
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ [e.target.name]: e.target.value })
    }

    return (
        <form>
            <CustomSelect
                label='País'
                onChange={(e) => { console.log(e.target) }}
                options={[]}
                value={state.country}
                labelKey='nombre'
                valueKey='alfa3'
            />
            <CustomSelect
                label='Tipo de Documento'
                onChange={() => { }}
                options={[]}
                value={state.documentType}
                labelKey='nombre'
                valueKey='alfa3'
            />
            <TextField
                label='ID'
                variant='outlined'
                fullWidth
                margin='dense'
                size='small'
                onChange={handleChange}
                name='identity'
                value={state.identity}
                autoFocus
            />
            <TextField
                label='Correo electrónico'
                variant='outlined'
                fullWidth
                margin='dense'
                size='small'
                onChange={handleChange}
                name='email'
                value={state.email}
            />
            <TextField
                label='Contraseña'
                type='password'
                variant='outlined'
                fullWidth
                margin='normal'
                size='small'
                onChange={handleChange}
                name='password'
                value={state.password}
            />
            <Button
                variant='contained'
                color='primary'
                fullWidth
                sx={{ marginTop: 2 }}
            >
                Registrarse
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
                <Link
                    variant='body2'
                    color='primary'
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/recover-password')}
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </Box>
        </form>
    )
}
