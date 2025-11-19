import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomSelect, CustomViewLoading } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { UpdateEmployeeDTO, EmployeeENTITY, State, ResourceSystemDTO } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Alert, IconButton, TextField, Tooltip } from '@mui/material'
import { useGetProfilesQuery, useUpdatePersonnelMutation } from '@shared/api'
import { lazy, Suspense, useEffect, useState } from 'react'
import { GridRowModel } from '@mui/x-data-grid'
import { Fallback } from '@app/ui/pages'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'

const ResourceSystemDialog = lazy(() => import('../components/ResourceSystemDialog').then(m => ({ default: m.ResourceSystemDialog })))

const resolver = classValidatorResolver(UpdateEmployeeDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    row: EmployeeENTITY
}

export function EditDialog(props: IProps) {

    const { open, setOpen, row } = props
    const {
        handleSubmit,
        formState: { errors },
        control,
        register
    } = useForm({ resolver, defaultValues: { ...row } })
    const { enqueueSnackbar } = useSnackbar()
    const [update, { isLoading }] = useUpdatePersonnelMutation()
    const { data: dataProfiles, isError: isErrorProfiles, isLoading: isLoadingProfiles, error } = useGetProfilesQuery()
    const [resourceSystem, setResourceSystem] = useState<readonly GridRowModel[]>([])
    const [openResourceSystemDialog, setOpenResourceSystemDialog] = useState(false)

    useEffect(() => {
        setResourceSystem(row.resourceSystem)
    }, [row])

    const onSubmit = async (data: UpdateEmployeeDTO) => {
        try {
            data.resourceSystem = [...(resourceSystem as ResourceSystemDTO[])]
            await update({ id: row._id, data }).unwrap()
            enqueueSnackbar({ message: 'Actualizado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <>
            <CustomDialog
                open={open}
                setOpen={setOpen}
                title={`EDITAR (${row.identity})`}
            >
                {
                    isLoadingProfiles
                        ? <CustomViewLoading />
                        : isErrorProfiles || !dataProfiles
                            ? <Alert severity='error'>{(error as Error)?.message}</Alert>
                            : <form onSubmit={handleSubmit(onSubmit)}>
                                <TextField
                                    label='Correo electrónico'
                                    variant='outlined'
                                    fullWidth
                                    margin='normal'
                                    autoFocus
                                    size='small'
                                    {...register('email')}
                                    autoComplete='email'
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                                <Controller
                                    name='_idprofile'
                                    control={control}
                                    render={({ field }) => (
                                        <CustomSelect
                                            label='Perfil'
                                            options={dataProfiles.filter(e => e.state === State.ACTIVO)}
                                            {...field}
                                            labelKey='name'
                                            valueKey='_id'
                                            margin='normal'
                                            error={!!errors._idprofile}
                                            helperText={errors._idprofile?.message}
                                        />
                                    )}
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
                                <CustomButtonSave isLoading={isLoading} />
                            </form>
                }
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
