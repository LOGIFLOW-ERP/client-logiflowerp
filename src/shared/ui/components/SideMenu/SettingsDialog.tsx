import React from 'react';
import {
    Typography,
    Box,
    Paper,
    Grid,
    TextField,
    Button,
    // FormControlLabel,
    // Switch,
    // Grid2,
    CircularProgress
} from '@mui/material';
import { CustomDialog } from '@shared/ui-library';
import { useStore } from '@shared/ui/hooks';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ChangePasswordDTO } from 'logiflowerp-sdk';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useChangePasswordMutation } from '@shared/api';

const resolver = classValidatorResolver(ChangePasswordDTO)

export const SettingsDialog = ({ open, onClose, }: { open: boolean; onClose: React.Dispatch<React.SetStateAction<boolean>>; }) => {

    const { state: { user } } = useStore('auth')
    const { enqueueSnackbar } = useSnackbar()
    const [changePassword, { isLoading }] = useChangePasswordMutation()

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
        setFocus
    } = useForm({ resolver })

    const onSubmit = async (data: ChangePasswordDTO) => {
        try {
            await changePassword(data).unwrap()
            reset()
            setTimeout(() => setFocus('password'), 1)
            enqueueSnackbar({ message: '¡Actualizado correctamente!', variant: 'success' })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <CustomDialog open={open} setOpen={onClose} title="Configuración de la cuenta">
            <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>Información personal</Typography>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField label="Nombre" fullWidth defaultValue={`${user.names} ${user.surnames}`} disabled size='small' />
                    </Grid>
                    <Grid size={6}>
                        <TextField label="Correo electrónico" fullWidth defaultValue={user.email} disabled size='small' />
                    </Grid>
                </Grid>
                {/* <Box mt={2}>
                    <Button variant="contained" color="primary">Guardar cambios</Button>
                </Box> */}
            </Paper>

            <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>Cambiar contraseña</Typography>
                <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                    {/* Campo oculto para username (recomendado para compatibilidad con navegadores y gestores de contraseñas) */}
                    <input type='text' name='username' autoComplete='username' hidden />
                    <Grid container spacing={1}>
                        <Grid size={12}>
                            <TextField
                                label='Contraseña actual'
                                type='password'
                                variant='outlined'
                                fullWidth
                                margin='dense'
                                size='small'
                                {...register('password')}
                                autoFocus
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                autoComplete='current-password'
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                label='Nueva contraseña'
                                type='password'
                                variant='outlined'
                                fullWidth
                                margin='dense'
                                size='small'
                                {...register('newPassword')}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
                                autoComplete='current-password'
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                label='Confirmar nueva contraseña'
                                type='password'
                                variant='outlined'
                                fullWidth
                                margin='dense'
                                size='small'
                                {...register('confirmNewPassword')}
                                error={!!errors.confirmNewPassword}
                                helperText={errors.confirmNewPassword?.message}
                                autoComplete='current-password'
                            />
                        </Grid>
                        <Grid size={12}>
                            <Box display="flex" justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="info"
                                    type='submit'
                                    disabled={isLoading}
                                    size='small'
                                >
                                    {
                                        isLoading
                                            ? <CircularProgress size={24} color='inherit' />
                                            : 'Actualizar contraseña'
                                    }
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            {/* <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Notificaciones</Typography>
                <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Recibir notificaciones por correo"
                />
                <FormControlLabel
                    control={<Switch />}
                    label="Recibir notificaciones por SMS"
                />
            </Paper> */}
        </CustomDialog>
    )
}
