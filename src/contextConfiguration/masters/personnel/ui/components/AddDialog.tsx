import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomSelect, CustomSelectDto } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { CreateEmployeeDTO, ResourceSystemDTO, State } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Alert, Avatar, Box, Card, CardContent, CardHeader, CircularProgress, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material'
import { useCreatePersonnelMutation, useGetCompaniesPipelineQuery, useGetProfilesQuery, useLazyGetUserByIdQuery } from '@shared/api'
import SearchIcon from '@mui/icons-material/Search'
import { lazy, Suspense, useEffect, useState } from 'react'
import { GridRowModel } from '@mui/x-data-grid'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'
import { Fallback } from '@app/ui/pages'

const ResourceSystemDialog = lazy(() => import('../components/ResourceSystemDialog').then(m => ({ default: m.ResourceSystemDialog })))

const resolver = classValidatorResolver(CreateEmployeeDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function AddDialog(props: IProps) {

    const { open, setOpen } = props
    const {
        handleSubmit,
        formState: { errors },
        register,
        getValues,
        trigger,
        control,
        setValue
    } = useForm({ resolver, defaultValues: { ...new CreateEmployeeDTO(), _id: crypto.randomUUID() } })
    const { enqueueSnackbar } = useSnackbar()
    const [create, { isLoading }] = useCreatePersonnelMutation()
    const [fetchUser, { data: user, isLoading: isLoadingUser, isError: isErrorUser, error: errorUser }] = useLazyGetUserByIdQuery()
    const { data: dataProfiles, isError: isErrorProfiles, isLoading: isLoadingProfiles } = useGetProfilesQuery()
    const pipelineCompanies = [{ $match: { state: State.ACTIVO } }]
    const { data: dataCompanies, isError: isErrorCompanies, isLoading: isLoadingCompanies } = useGetCompaniesPipelineQuery(pipelineCompanies)
    const [resourceSystem, setResourceSystem] = useState<readonly GridRowModel[]>([])
    const [openResourceSystemDialog, setOpenResourceSystemDialog] = useState(false)

    useEffect(() => {
        if (user?.email) {
            setValue('email', user.email)
        }
    }, [user])

    const onSubmit = async (data: CreateEmployeeDTO) => {
        try {
            data.resourceSystem = [...(resourceSystem as ResourceSystemDTO[])]
            await create(data).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <>
            <CustomDialog
                open={open}
                setOpen={setOpen}
                title='AGREGAR'
                maxWidth='sm'
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label='Identificación'
                        autoFocus
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        size='small'
                        {...register('identity')}
                        error={!!errors.identity}
                        helperText={errors.identity?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={async () => {
                                            const isValid = await trigger('identity') // 🔥 Valida solo 'identity'
                                            if (isValid) {
                                                await fetchUser(getValues('identity')).unwrap()
                                            }
                                        }}
                                        >
                                            {
                                                isLoadingUser
                                                    ? <CircularProgress color='inherit' />
                                                    : <SearchIcon />
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    {
                        isErrorUser && <Alert severity='error'>{(errorUser as Error)?.message}</Alert>
                    }
                    {
                        user && <>
                            <Card variant='outlined'>
                                <CardHeader
                                    avatar={<Avatar>{user.names[0]}{user.surnames[0]}</Avatar>}
                                    title={user.names}
                                    subheader={user.email}
                                />
                                <CardContent>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography variant='body2' fontWeight={410} marginRight={1}>Nombres:</Typography>
                                        <Typography variant='body2'>{user.names}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography variant='body2' fontWeight={410} marginRight={1}>Apellidos:</Typography>
                                        <Typography variant='body2'>{user.surnames}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography variant='body2' fontWeight={410} marginRight={1}>País:</Typography>
                                        <Typography variant='body2'>{user.country}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Controller
                                name='company'
                                control={control}
                                render={({ field }) => (
                                    <CustomSelectDto
                                        label='Empresa'
                                        options={dataCompanies ?? []}
                                        {...field}
                                        labelKey='companyname'
                                        valueKey='code'
                                        margin='normal'
                                        error={!!errors.company}
                                        helperText={errors.company?.message}
                                        isLoading={isLoadingCompanies}
                                        isError={isErrorCompanies}
                                    />
                                )}
                            />
                            <TextField
                                label='Correo electrónico'
                                variant='outlined'
                                fullWidth
                                margin='normal'
                                size='small'
                                {...register('email')}
                                autoComplete='email'
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <Tooltip title='Recursos de sistemas'>
                                <IconButton
                                    color='primary'
                                    aria-label='add resource system'
                                    onClick={() => setOpenResourceSystemDialog(true)}
                                >
                                    <DisplaySettingsIcon />
                                </IconButton>
                            </Tooltip>
                            <Controller
                                name='_idprofile'
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        label='Perfil'
                                        options={dataProfiles?.filter(e => e.state === State.ACTIVO) ?? []}
                                        {...field}
                                        labelKey='name'
                                        valueKey='_id'
                                        margin='normal'
                                        error={!!errors._idprofile}
                                        helperText={errors._idprofile?.message}
                                        isLoading={isLoadingProfiles}
                                        isError={isErrorProfiles}
                                    />
                                )}
                            />
                            <CustomButtonSave isLoading={isLoading} />
                        </>
                    }
                </form>
            </CustomDialog>
            <Suspense fallback={<Fallback />}>
                {
                    openResourceSystemDialog && (
                        <ResourceSystemDialog
                            open={openResourceSystemDialog}
                            setOpen={setOpenResourceSystemDialog}
                            resourceSystem={resourceSystem}
                            setResourceSystem={setResourceSystem}
                        />
                    )
                }
            </Suspense>
        </>
    )
}
