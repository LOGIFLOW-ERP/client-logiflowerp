import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomSelect, CustomViewLoading } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { UpdateEmployeeDTO, EmployeeENTITY, State } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Alert, TextField } from '@mui/material'
import { useGetProfilesQuery, useUpdatePersonnelMutation } from '@shared/api'

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

    const onSubmit = async (data: UpdateEmployeeDTO) => {
        try {
            await update({ id: row._id, data }).unwrap()
            enqueueSnackbar({ message: 'Actualizado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
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
                            <CustomButtonSave isLoading={isLoading} />
                        </form>
            }
        </CustomDialog>
    )
}
