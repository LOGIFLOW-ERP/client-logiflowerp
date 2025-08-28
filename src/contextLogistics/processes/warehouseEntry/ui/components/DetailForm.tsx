import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useAddDetailWarehouseEntryMutation, useGetProductPipelineQuery } from '@shared/api';
import { CustomAutocomplete } from '@shared/ui-library';
import { CreateOrderDetailDTO, ProductENTITY, State } from 'logiflowerp-sdk';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { usePermissions, useStore } from '@shared/ui/hooks';
import { PERMISSIONS } from '@shared/application';

const resolver = classValidatorResolver(CreateOrderDetailDTO)

export function DetalleForm() {

    const { setState, state: { selectedDocument } } = useStore('warehouseEntry')

    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        reset
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()
    const [canWarehouseEntryAddDetailByID] = usePermissions([PERMISSIONS.PUT_WAREHOUSE_ENTRY_ADD_DETAIL_BY_ID])

    const pipelineProducts = [{ $match: { state: State.ACTIVO, isDeleted: false } }]
    const { data: dataProducts, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useGetProductPipelineQuery(pipelineProducts)
    const [addDetail, { isLoading: isLoadingAddDetail }] = useAddDetailWarehouseEntryMutation()

    const onSubmit = async (data: CreateOrderDetailDTO) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            const document = await addDetail({ _id: selectedDocument._id, data }).unwrap()
            reset({ lot: '' })
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} >
            <Grid container spacing={2} columns={16}>
                <Grid size={{ md: 4 }} component='div'>
                    <Controller
                        name='item'
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete<ProductENTITY>
                                loading={isLoadingProducts}
                                options={dataProducts}
                                error={!!errors.item || isErrorProducts}
                                helperText={errors.item?.message || (errorProducts as Error)?.message}
                                value={dataProducts?.find((opt) => opt.itemCode === field.value?.itemCode) || null}
                                onChange={(_, newValue) => field.onChange(newValue ? newValue : undefined)}
                                label='Producto'
                                getOptionLabel={(option) => `${option.itemCode} - ${option.itemName}`}
                                isOptionEqualToValue={(option, value) => option.itemCode === value.itemCode}
                                margin='dense'
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ md: 2 }} component='div'>
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
                </Grid>
                <Grid size={{ md: 1.5 }} component='div'>
                    <TextField
                        label='Cantidad'
                        variant='outlined'
                        fullWidth
                        margin='dense'
                        size='small'
                        type="number"
                        {...register('amount', { valueAsNumber: true })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    />
                </Grid>
                <Grid size={{ md: 1 }} component='div'>
                    {
                        canWarehouseEntryAddDetailByID && (
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                fullWidth
                                sx={{ marginTop: 1 }}
                                loading={isLoadingAddDetail}
                                loadingIndicator={<CircularProgress size={24} color='warning' />}
                                loadingPosition='center'
                            >
                                <AddRoundedIcon />
                            </Button>
                        )
                    }
                </Grid>
            </Grid>
        </Box>
    )

}
