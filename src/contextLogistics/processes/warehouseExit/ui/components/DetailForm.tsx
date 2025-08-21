import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import {
    useAddDetailWarehouseExitMutation,
    useGetWarehouseStockPipelineQuery
} from '@shared/api';
import { CustomSelectDto } from '@shared/ui-library';
import { CreateWarehouseExitDetailDTO, State } from 'logiflowerp-sdk';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { usePermissions, useStore } from '@shared/ui/hooks';
import { PERMISSIONS } from '@shared/application';

const resolver = classValidatorResolver(CreateWarehouseExitDetailDTO)

export function DetalleForm() {

    const { setState, state: { selectedDocument } } = useStore('warehouseExit')

    const {
        handleSubmit,
        formState: { errors },
        watch,
        register,
        control,
        reset
    } = useForm({ resolver, defaultValues: new CreateWarehouseExitDetailDTO() })
    const { enqueueSnackbar } = useSnackbar()
    const [canWarehouseExitAddDetailByID] = usePermissions([PERMISSIONS.PUT_WAREHOUSE_EXIT_ADD_DETAIL_BY_ID])

    const pipelineWS = [{ $match: { state: State.ACTIVO, 'store.code': selectedDocument?.store.code } }]
    const { data: dataWS, isLoading: isLoadingWS, isError: isErrorWS } = useGetWarehouseStockPipelineQuery(pipelineWS)
    const [addDetail, { isLoading: isLoadingAddDetail }] = useAddDetailWarehouseExitMutation()

    const onSubmit = async (data: CreateWarehouseExitDetailDTO) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            const document = await addDetail({ _id: selectedDocument._id, data }).unwrap()
            reset(new CreateWarehouseExitDetailDTO())
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
                        name='warehouseStock'
                        control={control}
                        render={({ field }) => (
                            <CustomSelectDto
                                label='Producto'
                                options={dataWS ?? []}
                                {...field}
                                labelKey={['keyDetail', ' - ', 'keySearch']}
                                valueKey='_id'
                                margin='dense'
                                error={!!errors.warehouseStock}
                                helperText={errors.warehouseStock?.message}
                                autoFocus
                                isLoading={isLoadingWS}
                                isError={isErrorWS}
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
                        slotProps={{ input: { readOnly: true } }}
                        value={watch('warehouseStock')?.lot ?? ''}
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
                        canWarehouseExitAddDetailByID && (
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
