import { Button, CircularProgress, Grid2, TextField } from '@mui/material'
import { useGetMovementPipelineQuery, useGetStorePipelineQuery } from '@shared/api'
import { CustomSelectDto } from '@shared/ui-library'
import { CreateWarehouseEntryDTO, MovementOrder, State } from 'logiflowerp-sdk'
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form'

interface Props {
    control: Control<CreateWarehouseEntryDTO, any>
    errors: FieldErrors<CreateWarehouseEntryDTO>
    register: UseFormRegister<CreateWarehouseEntryDTO>
    readOnly: boolean
    isLoading: boolean
}

export function CabeceraForm(props: Props) {

    const { control, errors, readOnly, isLoading, register } = props

    const pipelineMovement = [{ $match: { movement: MovementOrder.INGRESO } }]
    const { data: dataMovements, isLoading: isLoadingMovements } = useGetMovementPipelineQuery(pipelineMovement)
    const pipelineStore = [{ $match: { state: State.ACTIVO } }]
    const { data: dataStores, isLoading: isLoadingStores } = useGetStorePipelineQuery(pipelineStore)

    if (isLoadingMovements || isLoadingStores) {
        return <CircularProgress />
    }

    return (
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
                            readOnly={readOnly}
                            autoFocus
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
                            readOnly={readOnly}
                        />
                    )}
                />
            </Grid2>
            <Grid2 size={{ md: 2.5 }} component='div'>
                <TextField
                    label='Dirección'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    size='small'
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    slotProps={{ input: { readOnly: readOnly } }}
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
                    slotProps={{ input: { readOnly: readOnly } }}
                />
            </Grid2>
            <Grid2 size={{ md: 1 }} component='div'>
                {
                    !readOnly && (
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
    )
}
