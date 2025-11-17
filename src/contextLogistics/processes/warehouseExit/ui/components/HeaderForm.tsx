import { Button, CircularProgress, Grid, TextField } from '@mui/material'
import {
    useGetMovementPipelineQuery,
    useGetPersonnelPipelineQuery,
    useGetStorePipelineQuery
} from '@shared/api'
import { PERMISSIONS } from '@shared/application'
import { CustomAutocomplete, CustomSelectDto } from '@shared/ui-library'
import { usePermissions } from '@shared/ui/hooks'
import { CreateWarehouseExitDTO, EmployeeENTITY, MovementOrder, ScrapingSystem, State } from 'logiflowerp-sdk'
import { Dispatch, SetStateAction, useState } from 'react'
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form'
import { ReposicionAutomaticaDialog } from './ReposicionAutomaticaDialog'

interface Props {
    control: Control<CreateWarehouseExitDTO, any>
    errors: FieldErrors<CreateWarehouseExitDTO>
    register: UseFormRegister<CreateWarehouseExitDTO>
    readOnly: boolean
    isLoading: boolean
    reposicion: null | ScrapingSystem
    setReposicion: Dispatch<SetStateAction<null | ScrapingSystem>>
    getValues: UseFormGetValues<CreateWarehouseExitDTO>
}

export function CabeceraForm(props: Props) {

    const { control, errors, readOnly, isLoading, register, reposicion, setReposicion, getValues } = props
    const [open, setOpen] = useState(false);
    const [canCreateWarehouseExit] = usePermissions([PERMISSIONS.POST_WAREHOUSE_EXIT])

    const pipelineMovement = [{ $match: { movement: MovementOrder.SALIDA } }]
    const { data: dataMovements, isLoading: isLoadingMovements, isError: isErrorMovements } = useGetMovementPipelineQuery(pipelineMovement)
    const pipelineStore = [{ $match: { state: State.ACTIVO } }]
    const { data: dataStores, isLoading: isLoadingStores, isError: isErrorStores } = useGetStorePipelineQuery(pipelineStore)
    const pipelinePersonnel = [{ $match: { state: State.ACTIVO } }]
    const { data: dataPersonnel, isLoading: isLoadingPersonnel, isError: isErrorPersonnel, error: errorPersonnel } = useGetPersonnelPipelineQuery(pipelinePersonnel)

    return (
        <Grid container spacing={2} columns={16}>
            <Grid size={{ md: 2 }} component='div'>
                <Controller
                    name='movement'
                    control={control}
                    render={({ field }) => (
                        <CustomSelectDto
                            label='Movimiento'
                            options={dataMovements ?? []}
                            {...field}
                            labelKey={['code', ' - ', 'name']}
                            valueKey='code'
                            margin='dense'
                            error={!!errors.movement}
                            helperText={errors.movement?.message}
                            readOnly={readOnly}
                            autoFocus
                            isLoading={isLoadingMovements}
                            isError={isErrorMovements}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ md: 2 }} component='div'>
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
                            isLoading={isLoadingStores}
                            isError={isErrorStores}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ md: 4 }} component='div'>
                <Controller
                    name='carrier'
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete<EmployeeENTITY>
                            loading={isLoadingPersonnel}
                            options={dataPersonnel}
                            error={!!errors.carrier || isErrorPersonnel}
                            helperText={errors.carrier?.message || (errorPersonnel as Error)?.message}
                            value={dataPersonnel?.find((opt) => opt.identity === field.value?.identity) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue : undefined)}
                            label='Personal'
                            getOptionLabel={(option) => `${option.identity} - ${option.names} ${option.surnames}`}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            margin='dense'
                            readOnly={readOnly}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ md: 2.5 }} component='div'>
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
            </Grid>
            {
                !readOnly &&
                <>
                    {
                        true && (
                            <Grid size={{ md: 1 }} component='div' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ReposicionAutomaticaDialog
                                    open={open}
                                    selectedValue={reposicion}
                                    setOpen={setOpen}
                                    setSelectedValue={setReposicion}
                                    getValues={getValues}
                                    dataPersonnel={dataPersonnel ?? []}
                                />
                            </Grid>
                        )
                    }
                    {
                        canCreateWarehouseExit && (
                            <Grid size={{ md: 1 }} component='div'>
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
                            </Grid>
                        )
                    }
                </>
            }
        </Grid>
    )
}
