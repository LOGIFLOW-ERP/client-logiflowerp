import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Box, Button, CircularProgress, Grid2, IconButton, Paper, TextField } from "@mui/material";
import { useGetProductByIdQuery, useGetProductPipelineQuery } from '@shared/api';
import { CustomSelectDto } from '@shared/ui-library';
import { CreateOrderDetailDTO, WarehouseEntryENTITY } from 'logiflowerp-sdk';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const resolver = classValidatorResolver(CreateOrderDetailDTO)

interface DetalleBoxProps {
    selectedRow: WarehouseEntryENTITY
}

export function DetalleForm(props: DetalleBoxProps) {

    const { } = props

    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()

    // const { data: dataProducts, isLoading: isLoadingProducts } = useGetProductPipelineQuery([])

    const onSubmit = async (data: CreateOrderDetailDTO) => {
        try {
            // const newDoc = await create(data).unwrap()
            enqueueSnackbar({ message: '¡Creado correctamente!', variant: 'success' })
            // setSelectedRow(newDoc)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    // if (isLoadingProducts) {
    //     return <CircularProgress />
    // }

    return (
        <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} >
            <Grid2 container spacing={2} columns={16}>
                <Grid2 size={{ md: 4 }} component='div'>
                    <Controller
                        name='item'
                        control={control}
                        render={({ field }) => (
                            <CustomSelectDto
                                label='Producto'
                                options={[]}
                                {...field}
                                labelKey='itemCode'
                                valueKey='itemName'
                                margin='dense'
                                error={!!errors.item}
                                helperText={errors.item?.message}
                            />
                        )}
                    />
                </Grid2>
                <Grid2 size={{ md: 2 }} component='div'>
                    <TextField
                        label='Lote'
                        variant='outlined'
                        fullWidth
                        margin='dense'
                        size='small'
                        {...register('lot')}
                        error={!!errors.lot}
                        helperText={errors.lot?.message}
                    />
                </Grid2>
                <Grid2 size={{ md: 1.5 }} component='div'>
                    <TextField
                        label='Cantidad'
                        variant='outlined'
                        fullWidth
                        margin='dense'
                        size='small'
                        type="number"
                        {...register('amount')}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    />
                </Grid2>
                <Grid2 size={{ md: 1 }} component='div'>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        sx={{ marginTop: 1 }}
                        loading={false}
                        loadingIndicator={<CircularProgress size={24} color='warning' />}
                        loadingPosition='center'
                    >
                        <AddRoundedIcon />
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
    )

}
