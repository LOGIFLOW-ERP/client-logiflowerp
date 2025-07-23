import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomSelect } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { UpdateCompanyDTO, getDataSupplier, CompanyENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useUpdateCompanyMutation } from '@shared/api'

const resolver = classValidatorResolver(UpdateCompanyDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    row: CompanyENTITY
}

export function EditDialog(props: IProps) {

    const { open, setOpen, row } = props
    const {
        handleSubmit,
        formState: { errors },
        register, control
    } = useForm({ resolver, defaultValues: { ...row } })
    const { enqueueSnackbar } = useSnackbar()
    const [update, { isLoading }] = useUpdateCompanyMutation()

    const onSubmit = async (data: UpdateCompanyDTO) => {
        try {
            await update({ id: row._id, data }).unwrap()
            enqueueSnackbar({ message: '¡Actualizado correctamente!', variant: 'success' })
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
            title={`EDITAR (${row.companyname})`}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='suppliertype'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='Tipo'
                            options={getDataSupplier()}
                            {...field}
                            labelKey='label'
                            valueKey='value'
                            margin='normal'
                            error={!!errors.suppliertype}
                            helperText={errors.suppliertype?.message}
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
                <TextField
                    label='Teléfono'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                />
                <TextField
                    label='Sitio web'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('website')}
                    error={!!errors.website}
                    helperText={errors.website?.message}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
