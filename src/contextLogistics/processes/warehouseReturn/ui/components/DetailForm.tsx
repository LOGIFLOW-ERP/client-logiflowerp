import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import {
    useAddDetailWarehouseReturnMutation,
    useGetEmployeeStockPipelineQuery,
} from '@shared/api';
import { CustomAutocomplete } from '@shared/ui-library';
import { CreateWarehouseReturnDetailDTO, EmployeeStockENTITY, State } from 'logiflowerp-sdk';
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
        reset,
        watch
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()
    const [canWarehouseReturnAddDetailByID] = usePermissions([PERMISSIONS.PUT_WAREHOUSE_RETURN_ADD_DETAIL_BY_ID])

    const pipelineES = [{
        $match: {
            state: State.ACTIVO,
            'store.code': selectedDocument?.store.code,
            'employee.identity': selectedDocument?.carrier.identity
        }
    }]
    const { data: dataES, isLoading: isLoadingES, isError: isErrorES, error: errorES } = useGetEmployeeStockPipelineQuery(pipelineES)
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
            <Grid container spacing={2} columns={16}>
                <Grid size={{ md: 4 }} component='div'>
                    <Controller
                        name='employeeStock'
                        control={control}
                        render={({ field }) => (
                            // <CustomSelectDto
                            //     label='Producto'
                            //     options={dataES ?? []}
                            //     {...field}
                            //     labelKey={['item.itemCode', ' - ', 'item.itemName', ' ', 'lot', ' ']}
                            //     valueKey='_id'
                            //     margin='dense'
                            //     error={!!errors.employeeStock}
                            //     helperText={errors.employeeStock?.message}
                            //     autoFocus
                            //     isLoading={isLoadingES}
                            //     isError={isErrorES}
                            // />
                            <CustomAutocomplete<EmployeeStockENTITY>
                                loading={isLoadingES}
                                options={dataES}
                                error={!!errors.employeeStock || isErrorES}
                                helperText={errors.employeeStock?.message || (errorES as Error)?.message}
                                value={dataES?.find((opt) => opt._id === field.value?._id) || null}
                                onChange={(_, newValue) => field.onChange(newValue ? newValue : undefined)}
                                label='Producto'
                                getOptionLabel={(option) => `${option.item.itemCode} - ${option.item.itemName} ${option.lot ? `- Lt. ${option.lot}` : ''}`.trim()}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
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
                        slotProps={{ input: { readOnly: true } }}
                        value={watch('employeeStock')?.lot ?? ''}
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
                        slotProps={{
                            htmlInput: { step: 'any' },
                        }}
                        {...register('amount', {
                            setValueAs: (v) =>
                                v === '' ? undefined : parseFloat(v.toString().replace(',', '.')),
                        })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    />
                </Grid>
                <Grid size={{ md: 1 }} component='div'>
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
                </Grid>
            </Grid>
        </Box>
    )

}
