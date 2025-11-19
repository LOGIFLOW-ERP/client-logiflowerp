import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomSelect } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { CreateCompanyPERDTO, getDataSupplier } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useCreateCompanyMutation } from '@shared/api'

const resolver = classValidatorResolver(CreateCompanyPERDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function AddDialog(props: IProps) {

    const { open, setOpen } = props
    const {
        handleSubmit,
        formState: { errors },
        register, control
    } = useForm({ resolver, defaultValues: new CreateCompanyPERDTO() })
    const { enqueueSnackbar } = useSnackbar()
    const [create, { isLoading }] = useCreateCompanyMutation()

    const onSubmit = async (data: CreateCompanyPERDTO) => {
        try {
            await create(data).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='AGREGAR'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label='RUC'
                    autoFocus
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('ruc')}
                    error={!!errors.ruc}
                    helperText={errors.ruc?.message}
                />
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
