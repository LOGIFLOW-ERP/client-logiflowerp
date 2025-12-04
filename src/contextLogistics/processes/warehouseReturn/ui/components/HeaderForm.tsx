import { Button, CircularProgress, Grid, TextField } from '@mui/material'
import {
    useGetMovementPipelineQuery,
    useGetPersonnelPipelineIndividualQuery,
    useGetPersonnelPipelineQuery,
    useGetStorePipelineQuery
} from '@shared/api'
import { PERMISSIONS } from '@shared/application'
import { CustomSelectDto } from '@shared/ui-library'
import { usePermissions } from '@shared/ui/hooks'
import { CreateWarehouseReturnDTO, MovementOrder, State } from 'logiflowerp-sdk'
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form'

interface Props {
    control: Control<CreateWarehouseReturnDTO, any>
    errors: FieldErrors<CreateWarehouseReturnDTO>
    register: UseFormRegister<CreateWarehouseReturnDTO>
    readOnly: boolean
    isLoading: boolean
}

export function CabeceraForm(props: Props) {

    const { control, errors, readOnly, isLoading, register } = props

    const [
        canCreateWarehouseReturn,
        canCreateDraftWarehouseReturn,
        canFindPersonnel
    ] = usePermissions([
        PERMISSIONS.POST_WAREHOUSE_RETURN,
        PERMISSIONS.POST_WAREHOUSE_RETURN_CREATE_DRAFT_RECORD,
        PERMISSIONS.POST_PERSONNEL_FIND,
    ])

    const pipelineMovement = [{ $match: { movement: MovementOrder.DEVOLUCION } }]
    const { data: dataMovements, isLoading: isLoadingMovements, isError: isErrorMovements } = useGetMovementPipelineQuery(pipelineMovement)
    const pipelineStore = [{ $match: { state: State.ACTIVO } }]
    const { data: dataStores, isLoading: isLoadingStores, isError: isErrorStores } = useGetStorePipelineQuery(pipelineStore)
    const pipelinePersonnel = [{ $match: { state: State.ACTIVO } }]
    const { data: dataPersonnel, isLoading: isLoadingPersonnel, isError: isErrorPersonnel } = canFindPersonnel
        ? useGetPersonnelPipelineQuery(pipelinePersonnel)
        : useGetPersonnelPipelineIndividualQuery(pipelinePersonnel)

    return (
        <Grid container spacing={1} columns={16}>
            <Grid size={{ md: 2, xs: 16 }} component='div'>
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
                            isLoading={isLoadingMovements}
                            isError={isErrorMovements}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ md: 2, xs: 16 }} component='div'>
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
            <Grid size={{ md: 2, xs: 16 }} component='div'>
                <Controller
                    name='carrier'
                    control={control}
                    render={({ field }) => (
                        <CustomSelectDto
                            label='Personal'
                            options={dataPersonnel ?? []}
                            {...field}
                            labelKey={['names', ' ', 'surnames', ' ', 'company.code']}
                            valueKey='identity'
                            margin='dense'
                            error={!!errors.carrier}
                            helperText={errors.carrier?.message}
                            readOnly={readOnly}
                            autoFocus
                            isLoading={isLoadingPersonnel}
                            isError={isErrorPersonnel}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ md: 2.5, xs: 16 }} component='div'>
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
            <Grid size={{ md: 1, xs: 16 }} component='div'>
                {
                    (!readOnly && (canCreateWarehouseReturn || canCreateDraftWarehouseReturn)) && (
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
            </Grid>
        </Grid>
    )
}
