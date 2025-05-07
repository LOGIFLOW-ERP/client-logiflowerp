import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Box, Button, CircularProgress, Grid2, TextField } from "@mui/material";
import {
    useAddDetailWarehouseReturnMutation,
    useGetEmployeeStockPipelineQuery,
} from '@shared/api';
import { CustomSelectDto } from '@shared/ui-library';
import { CreateWarehouseReturnDetailDTO, State } from 'logiflowerp-sdk';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { usePermissions, useStore } from '@shared/ui/hooks';
import { PERMISSIONS } from '@shared/application';

const resolver = classValidatorResolver(CreateWarehouseReturnDetailDTO)

export function DetalleForm() {

    const { setState, state: { selectedDocument } } = useStore('warehouseReturn')

    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        reset
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()
    const [canWarehouseReturnAddDetailByID] = usePermissions([PERMISSIONS.PUT_WAREHOUSE_RETURN_ADD_DETAIL_BY_ID])

    const pipelineWS = [{ $match: { state: State.ACTIVO, 'store.code': selectedDocument?.store.code } }]
    const { data: dataES, isLoading: isLoadingES, isError: isErrorES } = useGetEmployeeStockPipelineQuery(pipelineWS)
    const [addDetail, { isLoading: isLoadingAddDetail }] = useAddDetailWarehouseReturnMutation()

    const onSubmit = async (data: CreateWarehouseReturnDetailDTO) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            const document = await addDetail({ _id: selectedDocument._id, data }).unwrap()
            reset()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} >
            <Grid2 container spacing={2} columns={16}>
                <Grid2 size={{ md: 4 }} component='div'>
                    <Controller
                        name='employeeStock'
                        control={control}
                        render={({ field }) => (
                            <CustomSelectDto
                                label='Producto'
                                options={dataES ?? []}
                                {...field}
                                labelKey={['keyDetail', ' - ', 'keySearch']}
                                valueKey='_id'
                                margin='dense'
                                error={!!errors.employeeStock}
                                helperText={errors.employeeStock?.message}
                                autoFocus
                                isLoading={isLoadingES}
                                isError={isErrorES}
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
                        {...register('employeeStock.lot')}
                        slotProps={{ input: { readOnly: true } }}
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
                        {...register('amount', { valueAsNumber: true })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    />
                </Grid2>
                <Grid2 size={{ md: 1 }} component='div'>
                    {
                        canWarehouseReturnAddDetailByID && (
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
                </Grid2>
            </Grid2>
        </Box>
    )

}
