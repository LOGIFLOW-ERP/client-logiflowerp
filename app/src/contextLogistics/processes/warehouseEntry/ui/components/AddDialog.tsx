import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialogLoading, CustomFullScreenDialog, CustomSelectDto } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { CreateWarehouseEntryDTO, WarehouseEntryENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Box, Button, CircularProgress, Grid2, TextField } from '@mui/material'
import { useCreateWarehouseEntryMutation, useGetMovementPipelineQuery, useGetStorePipelineQuery, useValidateWarehouseEntryMutation } from '@shared/api'

const resolver = classValidatorResolver(CreateWarehouseEntryDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WarehouseEntryENTITY | undefined
    setSelectedRow: React.Dispatch<React.SetStateAction<WarehouseEntryENTITY | undefined>>
}

export function AddDialog(props: IProps) {

    const { open, setOpen, selectedRow, setSelectedRow } = props
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
    } = useForm({ resolver, defaultValues: { ...selectedRow } })
    const { enqueueSnackbar } = useSnackbar()

    const { data: dataMovements, isLoading: isLoadingMovements } = useGetMovementPipelineQuery([])
    const { data: dataStores, isLoading: isLoadingStores } = useGetStorePipelineQuery([])

    const [create, { isLoading }] = useCreateWarehouseEntryMutation()
    const [validate, { isLoading: isLoadingValidate }] = useValidateWarehouseEntryMutation()

    const onSubmit = async (data: CreateWarehouseEntryDTO) => {
        try {
            const newDoc = await create(data).unwrap()
            enqueueSnackbar({ message: '¡Creado correctamente!', variant: 'success' })
            setSelectedRow(newDoc)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleValidateClick = async () => {
        try {
            if (!selectedRow) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            await validate(selectedRow._id).unwrap()
            setOpen(false)
            enqueueSnackbar({ message: '¡Validado correctamente!', variant: 'success' })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isLoadingMovements || isLoadingStores) return <CustomDialogLoading open={open} setOpen={setOpen} />

    return (
        <CustomFullScreenDialog
            open={open}
            setOpen={setOpen}
            title='Nuevo ingreso de almacén'
            toolbar={
                selectedRow ? (
                    <Button
                        variant='contained'
                        color='success'
                        sx={{ marginTop: 1 }}
                        loading={isLoadingValidate}
                        loadingIndicator={<CircularProgress size={24} color='inherit' />}
                        loadingPosition='center'
                        onClick={handleValidateClick}
                    >
                        validar
                    </Button>
                )
                    : null
            }
        >
            <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} padding={1}>
                <Grid2 container spacing={2} columns={16}>
                    <Grid2 size={{ md: 2 }} component='div'>
                        <Controller
                            name='movement'
                            control={control}
                            render={({ field }) => (
                                <CustomSelectDto
                                    label='Movimiento'
                                    options={dataMovements ?? []}
                                    {...field}
                                    labelKey='name'
                                    valueKey='code'
                                    margin='dense'
                                    error={!!errors.movement}
                                    helperText={errors.movement?.message}
                                    readOnly={!!selectedRow}
                                />
                            )}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 2 }} component='div'>
                        <Controller
                            name='store'
                            control={control}
                            render={({ field }) => (
                                <CustomSelectDto
                                    label='Almacén'
                                    options={dataStores ?? []}
                                    {...field}
                                    labelKey='name'
                                    valueKey='code'
                                    margin='dense'
                                    error={!!errors.store}
                                    helperText={errors.store?.message}
                                    readOnly={!!selectedRow}
                                />
                            )}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 2 }} component='div'>
                        <TextField
                            label='Dirección'
                            variant='outlined'
                            fullWidth
                            margin='dense'
                            size='small'
                            {...register('address')}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                            slotProps={{ input: { readOnly: !!selectedRow } }}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 2 }} component='div'>
                        <TextField
                            label='Guía de transporte'
                            variant='outlined'
                            fullWidth
                            margin='dense'
                            size='small'
                            {...register('transportGuide')}
                            error={!!errors.transportGuide}
                            helperText={errors.transportGuide?.message}
                            slotProps={{ input: { readOnly: !!selectedRow } }}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 1 }} component='div'>
                        {
                            !selectedRow && (
                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    fullWidth
                                    sx={{ marginTop: 1 }}
                                    loading={isLoading}
                                    loadingIndicator={<CircularProgress size={24} color='warning' />}
                                    loadingPosition='center'
                                >
                                    crear
                                </Button>
                            )
                        }
                    </Grid2>
                </Grid2>
            </Box>
            {/* <Grid2 size={{ md: 1 }} component='div'>
                {
                    selectedRow ? (
                        <Button
                            variant='contained'
                            color='primary'
                            fullWidth
                            sx={{ marginTop: 1 }}
                            loading={isLoadingValidate}
                            loadingIndicator={<CircularProgress size={24} color='inherit' />}
                            loadingPosition='center'
                            onClick={handleValidateClick}
                        >
                            validar
                        </Button>
                    )
                        : null
                }
            </Grid2> */}
        </CustomFullScreenDialog>
    )
}
