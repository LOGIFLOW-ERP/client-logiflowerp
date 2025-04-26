import { CustomDialog } from '@shared/ui-library'
import { StockSerialDTO } from 'logiflowerp-sdk'
import { Box, Button, CircularProgress, Grid2, TextField } from '@mui/material'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import {
    useAddSerialWarehouseEntryMutation,
    useDeleteSerialWarehouseEntryMutation
} from '@shared/api'
import { DataGrid } from '@mui/x-data-grid'
import { columnsSerial } from '../GridCol'
import { useStore } from '@shared/ui/hooks'

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
        register
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()
    const [addSerial, { isLoading: isLoadingAddSerial }] = useAddSerialWarehouseEntryMutation()
    const [deleteSerial, { isLoading: isLoadingDeleteSerial }] = useDeleteSerialWarehouseEntryMutation()

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
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
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
            enqueueSnackbar({ message: '¡Detalle eliminado!', variant: 'success' })
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='AGREGAR'
        >
            <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                <Grid2 container spacing={2} >
                    <Grid2 size={{ md: 12 }} component='div'>
                        <TextField
                            label='Serie'
                            variant='outlined'
                            fullWidth
                            margin='dense'
                            size='small'
                            {...register('serial')}
                            error={!!errors.serial}
                            helperText={errors.serial?.message}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 6 }} component='div'>
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
                    </Grid2>
                    <Grid2 size={{ md: 6 }} component='div'>
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
                    </Grid2>
                    <Grid2 component='div'>
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
                    </Grid2>
                </Grid2>
            </Box>
            <Box sx={{ height: '100%' }}>
                <DataGrid<StockSerialDTO>
                    rows={selectedDetail?.serials}
                    columns={columnsSerial({ handleDeleteClick })}
                    disableRowSelectionOnClick
                    getRowId={row => row.serial}
                    loading={isLoadingDeleteSerial}
                    autoPageSize
                />
            </Box>
        </CustomDialog>
    )
}
