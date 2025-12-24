import { CustomDialog, CustomViewError } from '@shared/ui-library'
import { StateStockSerialWarehouse, StockSerialDTO } from 'logiflowerp-sdk'
import { Autocomplete, Box, Button, CircularProgress, Grid, TextField, Tooltip } from '@mui/material'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useSnackbar } from 'notistack'
import { Controller, useForm } from 'react-hook-form'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import {
    useAddSerialWarehouseExitMutation,
    useDeleteSerialWarehouseExitMutation,
    useGetWarehouseStockSerialPipelineQuery,
} from '@shared/api'
import { DataGrid } from '@mui/x-data-grid'
import { columnsSerial } from '../GridCol/columnsSerial'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import ViewListIcon from '@mui/icons-material/ViewList';
import { lazy, Suspense, useState } from 'react'
import { Fallback } from '@app/ui/pages'
const WarehouseStockSerialDialog = lazy(() => import('./WarehouseStockSerialDialog').then(m => ({ default: m.WarehouseStockSerialDialog })))

const resolver = classValidatorResolver(StockSerialDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function SerialsDialog(props: IProps) {

    const { open, setOpen } = props
    const { setState, state: { selectedDetail, selectedDocument } } = useStore('warehouseExit')

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
        setFocus,
        control
    } = useForm({ resolver, defaultValues: new StockSerialDTO() })
    const { enqueueSnackbar } = useSnackbar()
    const [serialInput, setSerialInput] = useState('')
    const [addSerial, { isLoading: isLoadingAddSerial }] = useAddSerialWarehouseExitMutation()
    const [deleteSerial, { isLoading: isLoadingDeleteSerial }] = useDeleteSerialWarehouseExitMutation()
    const [canWarehouseExitDeleteSerialByID] = usePermissions([PERMISSIONS.PUT_WAREHOUSE_EXIT_DELETE_SERIAL_BY_ID])
    const [openWarehouseStockSerialDialog, setOpenWarehouseStockSerialDialog] = useState(false)
    const pipeline = [{ // Cualquier cambio en este pipeline debe ser reflejado en el componente WarehouseStockSerialDialog
        $match: {
            keySearch: selectedDetail?.keySearch,
            keyDetail: selectedDetail?.keyDetail,
            state: StateStockSerialWarehouse.DISPONIBLE
        }
    }]
    const { data, error, isLoading, isError } = useGetWarehouseStockSerialPipelineQuery(pipeline)

    const onSubmit = async (data: StockSerialDTO) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            if (!selectedDetail) {
                throw new Error('¡No hay un detalle seleccionado!')
            }
            const document = await addSerial({
                _id: selectedDocument._id,
                keyDetail: selectedDetail.keyDetail,
                data
            }).unwrap()
            reset(new StockSerialDTO())
            setSerialInput('')
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        } finally {
            setTimeout(() => setFocus('serial'), 1)
        }
    }

    const handleDeleteClick = async (row: StockSerialDTO) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            if (!selectedDetail) {
                throw new Error('¡No hay un detalle seleccionado!')
            }
            const document = await deleteSerial({
                _id: selectedDocument._id,
                keyDetail: selectedDetail.keyDetail,
                serial: row.serial
            }).unwrap()
            setState({ selectedDocument: document })
            enqueueSnackbar({ message: '¡Serie eliminado!', variant: 'success' })
            setTimeout(() => setFocus('serial'), 1)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError error={error} />

    return (
        <>
            <CustomDialog
                open={open}
                setOpen={setOpen}
                title={`AGREGAR SERIES ${selectedDetail ? ` - ${selectedDetail.serials.length} de ${selectedDetail.amount}` : '¡Error!'}`.trim()}
            >
                {
                    (!!selectedDetail && selectedDetail.amount !== selectedDetail.serials.length) && (
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
                                <Grid size={{ md: 2 }} component='div'>
                                    <Tooltip title='Ver series disponibles'>
                                        <span>
                                            <Button
                                                variant='contained'
                                                color='info'
                                                fullWidth
                                                sx={{ marginTop: 1 }}
                                                loading={isLoadingAddSerial || isLoading}
                                                loadingIndicator={<CircularProgress size={24} color='warning' />}
                                                loadingPosition='center'
                                                onClick={() => setOpenWarehouseStockSerialDialog(true)}
                                            >
                                                <ViewListIcon />
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </Grid>
                                <Grid size={{ md: 8 }} component='div'>
                                    {/* <TextField
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
                                    /> */}
                                    <Controller
                                        name="serial"
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                freeSolo
                                                loading={isLoading}
                                                options={data ?? []}
                                                inputValue={serialInput}
                                                getOptionLabel={(option) =>
                                                    typeof option === 'string' ? option : option.serial
                                                }
                                                filterOptions={(options, { inputValue }) =>
                                                    options.filter(o =>
                                                        o.serial.toLowerCase().includes(inputValue.toLowerCase())
                                                    )
                                                }
                                                onInputChange={(_, value) => {
                                                    setSerialInput(value)
                                                    field.onChange(value)
                                                }}
                                                onChange={(_, value) => {
                                                    if (typeof value === 'string') {
                                                        setSerialInput(value)
                                                        field.onChange(value)
                                                    } else if (value) {
                                                        setSerialInput(value.serial)
                                                        field.onChange(value.serial)
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Serie"
                                                        variant="outlined"
                                                        fullWidth
                                                        margin="dense"
                                                        size="small"
                                                        autoFocus
                                                        error={!!errors.serial}
                                                        helperText={errors.serial?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ md: 4 }} component='div'>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        fullWidth
                                        sx={{ marginTop: 1 }}
                                        loading={isLoadingAddSerial || isLoading}
                                        loadingIndicator={<CircularProgress size={24} color='warning' />}
                                        loadingPosition='center'
                                    >
                                        <AddRoundedIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                }
                <Box sx={{ height: '50vh' }}>
                    <DataGrid<StockSerialDTO>
                        rows={selectedDetail?.serials}
                        columns={columnsSerial({ handleDeleteClick })}
                        disableRowSelectionOnClick
                        getRowId={row => row.serial}
                        loading={isLoadingDeleteSerial}
                        autoPageSize
                        columnVisibilityModel={{
                            actions: canWarehouseExitDeleteSerialByID
                        }}
                    />
                </Box>
            </CustomDialog>
            <Suspense fallback={<Fallback />}>
                {
                    (selectedDetail && openWarehouseStockSerialDialog) && (
                        <WarehouseStockSerialDialog
                            open={openWarehouseStockSerialDialog}
                            setOpen={setOpenWarehouseStockSerialDialog}
                            selectedRow={selectedDetail}
                        />
                    )
                }
            </Suspense>
        </>
    )
}
