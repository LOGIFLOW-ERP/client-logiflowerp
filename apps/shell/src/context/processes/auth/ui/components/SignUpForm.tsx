import { Box, Button, Divider, Link, SelectChangeEvent, TextField } from '@mui/material'
import { CustomSelect } from '@shared/ui-library'
import { useStore } from '@shared/ui/hooks'
import { useNavigate } from 'react-router-dom'
import { dataCountry, State, getDataDocumentTypes } from 'logiflowerp-sdk'

export function SignUpForm() {

    const { actions: { setState }, state } = useStore('auth')
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ [e.target.name]: e.target.value })
    }

    const handleSelectChange = (e: SelectChangeEvent) => {
        setState({ [e.target.name]: e.target.value })
    }

    return (
        <form>
            <CustomSelect
                label='País'
                onChange={handleSelectChange}
                options={dataCountry.filter(e => e.estado === State.ACTIVO)}
                value={state.country}
                labelKey='nombre'
                valueKey='alfa3'
                name='country'
                margin='normal'
            />
            <CustomSelect
                label='Tipo de Documento'
                onChange={handleSelectChange}
                options={getDataDocumentTypes()}
                value={state.documentType}
                labelKey='label'
                valueKey='value'
                name='documentType'
                margin='normal'
            />
            <TextField
                label='ID'
                variant='outlined'
                fullWidth
                margin='normal'
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
                margin='normal'
                size='small'
                onChange={handleChange}
                name='email'
                value={state.email}
                autoComplete='email'
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
                autoComplete='current-password'
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
            </Box>
        </form>
    )
}
