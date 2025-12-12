import { CustomDialog } from '@shared/ui-library'
import { StockSerialDTO } from 'logiflowerp-sdk'
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import {
    useAddDetailBySerialWarehouseExitMutation,
} from '@shared/api'
import { useStore } from '@shared/ui/hooks'

const resolver = classValidatorResolver(StockSerialDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function AddDetailBySerialDialog(props: IProps) {

    const { open, setOpen } = props
    const { setState, state: { selectedDocument } } = useStore('warehouseExit')

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
        setFocus
    } = useForm({ resolver, defaultValues: new StockSerialDTO() })
    const { enqueueSnackbar } = useSnackbar()
    const [addDetailBySerial, { isLoading }] = useAddDetailBySerialWarehouseExitMutation()

    const onSubmit = async (data: StockSerialDTO) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            const document = await addDetailBySerial({
                _id: selectedDocument._id,
                data
            }).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        } finally {
            reset(new StockSerialDTO())
            setTimeout(() => setFocus('serial'), 1)
        }
    }

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title={`Agregar detalle por serie`}
        >
            <Box component='form' onSubmit={handleSubmit(onSubmit)} paddingBottom={2}>
                <Grid container columnSpacing={3}>
                    <Grid size={{ md: 5 }} component='div'>
                        <TextField
                            label='Marca'
                            variant='outlined'
                            fullWidth
                            margin='dense'
                            size='small'
                            {...register('brand')}
                            error={!!errors.brand}
                            helperText={errors.brand?.message}
                        />
                    </Grid>
                    <Grid size={{ md: 5 }} component='div'>
                        <TextField
                            label='Modelo'
                            variant='outlined'
                            fullWidth
                            margin='dense'
                            size='small'
                            {...register('model')}
                            error={!!errors.model}
                            helperText={errors.model?.message}
                        />
                    </Grid>
                    <Grid size={{ md: 8 }} component='div'>
                        <TextField
                            label='Serie'
                            variant='outlined'
                            fullWidth
                            margin='dense'
                            autoFocus
                            size='small'
                            {...register('serial')}
                            error={!!errors.serial}
                            helperText={errors.serial?.message}
                            autoComplete='off'
                        />
                    </Grid>
                    <Grid size={{ md: 4 }} component='div'>
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            fullWidth
                            sx={{ marginTop: 1 }}
                            loading={isLoading}
                            loadingIndicator={<CircularProgress size={24} color='warning' />}
                            loadingPosition='center'
                        >
                            <AddRoundedIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </CustomDialog>
    )
}
