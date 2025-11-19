import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import {
    useAddDetailWarehouseExitMutation,
    useFindWithAvailableWarehouseStockQuery,
    useLazyReportEmployeeStockQuery,
} from '@shared/api';
import { CustomAutocomplete } from '@shared/ui-library';
import {
    CreateWarehouseExitDetailDTO,
    EmployeeStockENTITYFlat,
    State,
    WarehouseStockENTITY
} from 'logiflowerp-sdk';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { usePermissions, useStore } from '@shared/ui/hooks';
import { PERMISSIONS } from '@shared/application';
import { lazy, Suspense, useState } from 'react';
import { Fallback } from '@app/ui/pages';
const EmployeeStockDialog = lazy(() => import('../components/EmployeeStockDialog').then(m => ({ default: m.EmployeeStockDialog })))

const resolver = classValidatorResolver(CreateWarehouseExitDetailDTO)

export function DetalleForm() {

    const { setState, state: { selectedDocument } } = useStore('warehouseExit')
    const [dataES, setDataES] = useState<EmployeeStockENTITYFlat[]>([])
    const [open, setOpen] = useState<boolean>(false)

    const {
        handleSubmit,
        formState: { errors },
        watch,
        register,
        control,
        reset,
        getValues
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()
    const [
        canWarehouseExitAddDetailByID,
        POST_EMPLOYEE_STOCK_REPORT,
    ] = usePermissions([
        PERMISSIONS.PUT_WAREHOUSE_EXIT_ADD_DETAIL_BY_ID,
        PERMISSIONS.POST_EMPLOYEE_STOCK_REPORT
    ])

    const pipelineWS = [{ $match: { state: State.ACTIVO, 'store.code': selectedDocument?.store.code } }]
    const { data: dataWS, isLoading: isLoadingWS, isError: isErrorWS, error: errorWS } = useFindWithAvailableWarehouseStockQuery(pipelineWS)
    const [addDetail, { isLoading: isLoadingAddDetail }] = useAddDetailWarehouseExitMutation()

    const [fetchEmployeeStock, { isFetching: isFetchingES }] = useLazyReportEmployeeStockQuery()

    const onSubmit = async (data: CreateWarehouseExitDetailDTO) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            const document = await addDetail({ _id: selectedDocument._id, data }).unwrap()
            reset()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const onClickShowEmployeeStock = async () => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            const pipeline = [{
                $match: {
                    state: State.ACTIVO,
                    'store.code': selectedDocument?.store.code,
                    'employee.identity': selectedDocument?.carrier.identity,
                    'item.itemCode': getValues('warehouseStock.item.itemCode'),
                    stockType: selectedDocument.movement.stockType
                }
            }]
            const data = await fetchEmployeeStock(pipeline).unwrap()
            setDataES(data)
            setOpen(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <>
            <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} >
                <Grid container spacing={2} columns={16}>
                    <Grid size={{ md: 4 }} component='div'>
                        <Controller
                            name='warehouseStock'
                            control={control}
                            render={({ field }) => (
                                <CustomAutocomplete<WarehouseStockENTITY>
                                    loading={isLoadingWS}
                                    options={dataWS}
                                    error={!!errors.warehouseStock || isErrorWS}
                                    helperText={errors.warehouseStock?.message || (errorWS as Error)?.message}
                                    value={dataWS?.find((opt) => opt._id === field.value?._id) || null}
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
                            value={watch('warehouseStock')?.lot ?? ''}
                        />
                    </Grid>
                    <Grid size={{ md: 1 }} component='div'>
                        <TextField
                            label='Disponible'
                            variant='outlined'
                            type='number'
                            fullWidth
                            margin='dense'
                            size='small'
                            slotProps={{ input: { readOnly: true } }}
                            value={watch('warehouseStock')?.available ?? ''}
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
                    {
                        (POST_EMPLOYEE_STOCK_REPORT && getValues('warehouseStock.item.itemCode')) && (
                            <Grid size={{ md: 1 }} component='div'>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    fullWidth
                                    sx={{ marginTop: 1 }}
                                    loading={isFetchingES}
                                    loadingIndicator={<CircularProgress size={24} color='warning' />}
                                    loadingPosition='center'
                                    onClick={onClickShowEmployeeStock}
                                >
                                    <Inventory2Icon />
                                </Button>
                            </Grid>
                        )
                    }
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
            <Suspense fallback={<Fallback />}>
                {
                    open && (
                        <EmployeeStockDialog
                            open={open}
                            setOpen={setOpen}
                            dataES={dataES}
                        />
                    )
                }
            </Suspense>
        </>
    )

}
