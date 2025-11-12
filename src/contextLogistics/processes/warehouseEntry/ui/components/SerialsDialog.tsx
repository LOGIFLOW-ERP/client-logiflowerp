import { CustomDialog } from '@shared/ui-library'
import { StockSerialDTO } from 'logiflowerp-sdk'
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import {
    useAddSerialWarehouseEntryMutation,
    useDeleteSerialWarehouseEntryMutation
} from '@shared/api'
import { DataGrid } from '@mui/x-data-grid'
import { columnsSerial } from '../GridCol/columnsSerial'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'

const resolver = classValidatorResolver(StockSerialDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function SerialsDialog(props: IProps) {

    const { open, setOpen } = props
    const { setState, state: { selectedDetail, selectedDocument } } = useStore('warehouseEntry')

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
        setFocus
    } = useForm({ resolver, defaultValues: new StockSerialDTO() })
    const { enqueueSnackbar } = useSnackbar()
    const [addSerial, { isLoading: isLoadingAddSerial }] = useAddSerialWarehouseEntryMutation()
    const [deleteSerial, { isLoading: isLoadingDeleteSerial }] = useDeleteSerialWarehouseEntryMutation()
    const [canWarehouseEntryDeleteSerialByID] = usePermissions([PERMISSIONS.PUT_WAREHOUSE_ENTRY_DELETE_SERIAL_BY_ID])

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
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
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
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title={`AGREGAR SERIES ${selectedDetail ? ` - ${selectedDetail.serials.length} de ${selectedDetail.amount}` : '¡Error!'}`.trim()}
        >
            {
                (!!selectedDetail && selectedDetail.amount !== selectedDetail.serials.length) && (
                    <Box component='form' onSubmit={handleSubmit(onSubmit)} paddingBottom={2}>
                        <Grid container columnSpacing={2}>
                            <Grid size={{ md: 6 }} component='div'>
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
                            <Grid size={{ md: 6 }} component='div'>
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
                                    loading={isLoadingAddSerial}
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
                        actions: canWarehouseEntryDeleteSerialByID
                    }}
                />
            </Box>
        </CustomDialog>
    )
}
