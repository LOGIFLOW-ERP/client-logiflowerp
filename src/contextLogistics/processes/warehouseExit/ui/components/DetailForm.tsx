import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Box, Button, CircularProgress, Grid, InputAdornment, OutlinedInput, TextField, Tooltip } from "@mui/material";
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
import { usePermissions, useStore } from '@shared/ui/hooks';
import { PERMISSIONS } from '@shared/application';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Fallback } from '@app/ui/pages';
import Person2Icon from '@mui/icons-material/Person2';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

const EmployeeStockDialog = lazy(() => import('../components/EmployeeStockDialog').then(m => ({ default: m.EmployeeStockDialog })))
const AddDetailBySerialDialog = lazy(() => import('./AddDetailBySerialDialog').then(m => ({ default: m.AddDetailBySerialDialog })))

const resolver = classValidatorResolver(CreateWarehouseExitDetailDTO)

export function DetalleForm() {

    const { setState, state: { selectedDocument } } = useStore('warehouseExit')
    const [dataES, setDataES] = useState<EmployeeStockENTITYFlat[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [openAddDetailBySerial, setOpenAddDetailBySerial] = useState<boolean>(false)
    const [employeeStock, setEmployeeStock] = useState<number | null>(null)

    const {
        handleSubmit,
        formState: { errors },
        watch,
        register,
        control,
        reset,
        getValues,
        setFocus
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()
    const [
        canWarehouseExitAddDetailByID,
        POST_EMPLOYEE_STOCK_REPORT,
        PUT_WAREHOUSE_EXIT_ADD_DETAIL_BY_SERIAL_BY_ID
    ] = usePermissions([
        PERMISSIONS.PUT_WAREHOUSE_EXIT_ADD_DETAIL_BY_ID,
        PERMISSIONS.POST_EMPLOYEE_STOCK_REPORT,
        PERMISSIONS.PUT_WAREHOUSE_EXIT_ADD_DETAIL_BY_SERIAL_BY_ID,
    ])

    const pipelineWS = [{
        $match: {
            state: State.ACTIVO,
            'store.code': selectedDocument?.store.code,
            stockType: selectedDocument?.movement.stockType
        }
    }]
    const { data: dataWS, isLoading: isLoadingWS, isError: isErrorWS, error: errorWS } = useFindWithAvailableWarehouseStockQuery(pipelineWS)
    const [addDetail, { isLoading: isLoadingAddDetail }] = useAddDetailWarehouseExitMutation()

    const [fetchEmployeeStock, { isFetching: isFetchingES, data: employeeStockData }] = useLazyReportEmployeeStockQuery()

    useEffect(() => {
        if (employeeStockData) {
            const stock = employeeStockData.reduce((acc, item) => acc + item.stock, 0)
            setEmployeeStock(stock)
        }
    }, [employeeStockData])

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
                                    onChange={async (_, newValue) => {
                                        field.onChange(newValue ? newValue : undefined)
                                        setFocus('amount')
                                        if (selectedDocument && newValue) {
                                            const pipeline = [{
                                                $match: {
                                                    state: State.ACTIVO,
                                                    'store.code': selectedDocument.store.code,
                                                    'employee.identity': selectedDocument.carrier.identity,
                                                    'item.itemCode': newValue.item.itemCode,
                                                    stockType: selectedDocument.movement.stockType
                                                }
                                            }]
                                            await fetchEmployeeStock(pipeline).unwrap()
                                        }
                                    }}
                                    label='Producto'
                                    getOptionLabel={(option) => `${option.item.itemCode} - ${option.item.itemName} ${option.lot ? `- Lt. ${option.lot}` : ''}`.trim()}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    margin='dense'
                                />
                            )}
                        />
                    </Grid>
                    {
                        getValues('warehouseStock.item.itemCode') &&
                        <>
                            <Grid size={{ md: 1.6 }} component='div'>
                                <Tooltip title='Lote de producto seleccionado'>
                                    <TextField
                                        label='Lote'
                                        variant='outlined'
                                        fullWidth
                                        margin='dense'
                                        size='small'
                                        slotProps={{ input: { readOnly: true } }}
                                        value={watch('warehouseStock')?.lot ?? ''}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid size={{ md: 1.2 }} component='div'>
                                <Tooltip title='Disponible stock almacén'>
                                    <OutlinedInput
                                        id="outlined-adornment-weight"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <WarehouseIcon fontSize='small' />
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{
                                            'aria-label': 'weight',
                                        }}
                                        value={watch('warehouseStock')?.available ?? ''}
                                        slotProps={{ input: { readOnly: true } }}
                                        size='small'
                                        fullWidth
                                        margin='dense'
                                        sx={{ marginTop: 1 }}
                                    />
                                </Tooltip>
                            </Grid>
                            {
                                POST_EMPLOYEE_STOCK_REPORT && (
                                    <Grid size={{ md: 1.2 }} component='div'>
                                        <Tooltip title='Disponible stock personal'>
                                            <Button
                                                variant='outlined'
                                                color='warning'
                                                fullWidth
                                                sx={{ marginTop: 1, fontWeight: 'bold', gap: 1 }}
                                                loading={isFetchingES}
                                                loadingIndicator={<CircularProgress size={24} color='warning' />}
                                                loadingPosition='center'
                                                onClick={onClickShowEmployeeStock}
                                            >
                                                {employeeStock}
                                                <Person2Icon fontSize='small' />
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                )
                            }
                        </>
                    }
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
                            disabled={!getValues('warehouseStock.item.itemCode')}
                        />
                    </Grid>
                    {
                        canWarehouseExitAddDetailByID && (
                            <>
                                <Grid size={{ md: 1 }} component='div'>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        fullWidth
                                        sx={{ marginTop: 1 }}
                                        loading={isLoadingAddDetail}
                                        loadingIndicator={<CircularProgress size={24} color='warning' />}
                                        loadingPosition='center'
                                        disabled={!getValues('warehouseStock.item.itemCode')}
                                    >
                                        <AddRoundedIcon />
                                    </Button>

                                </Grid>
                                {
                                    PUT_WAREHOUSE_EXIT_ADD_DETAIL_BY_SERIAL_BY_ID && (
                                        <Grid size={{ md: 1 }} component='div'>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                fullWidth
                                                sx={{ marginTop: 1 }}
                                                loading={isLoadingAddDetail}
                                                loadingIndicator={<CircularProgress size={24} color='warning' />}
                                                loadingPosition='center'
                                                onClick={() => setOpenAddDetailBySerial(true)}
                                            >
                                                <DocumentScannerIcon />
                                            </Button>
                                        </Grid>
                                    )
                                }
                            </>
                        )
                    }
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
                {
                    openAddDetailBySerial && (
                        <AddDetailBySerialDialog
                            open={openAddDetailBySerial}
                            setOpen={setOpenAddDetailBySerial}
                        />
                    )
                }
            </Suspense>
        </>
    )

}
