import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomRichTreeView, CustomSelect, CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { buildMenu, CreateRootCompanyPERDTO, dataCountry, getDataSupplier, State } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useCreateRootCompanyMutation, useGetSystemOptionsPipelineQuery } from '@shared/api'
import { useEffect, useState } from 'react'

const resolver = classValidatorResolver(CreateRootCompanyPERDTO)

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
    } = useForm({ resolver, defaultValues: { ...new CreateRootCompanyPERDTO() } })
    const { enqueueSnackbar } = useSnackbar()
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const filtersSystemOptions = [{ $match: { root: false } }]
    const { data: dataSystemOptions, error: errorSystemOptions, isLoading: isLoadingSystemOptions } = useGetSystemOptionsPipelineQuery(filtersSystemOptions)
    const [create, { isLoading }] = useCreateRootCompanyMutation()
    useEffect(() => console.log(selectedItems), [selectedItems])

    const onSubmit = async (data: CreateRootCompanyPERDTO) => {
        try {
            data.systemOptions = selectedItems
            await create(data).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isLoadingSystemOptions) return <CustomViewLoading />
    if (errorSystemOptions) return <CustomViewError />
 
    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='AGREGAR'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='País'
                            options={dataCountry.filter(e => e.estado === State.ACTIVO)}
                            {...field}
                            labelKey='nombre'
                            valueKey='alfa3'
                            margin='normal'
                            error={!!errors.country}
                            helperText={errors.country?.message}
                        />
                    )}
                />
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
                <TextField
                    label='Gerente'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('manager')}
                    error={!!errors.manager}
                    helperText={errors.manager?.message}
                />
                <CustomRichTreeView
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    items={buildMenu(dataSystemOptions ?? [])}
                />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    fullWidth
                    sx={{ marginTop: 2 }}
                    disabled={isLoading}
                >
                    {
                        isLoading
                            ? <CircularProgress size={24} color='inherit' />
                            : 'Guardar'
                    }
                </Button>
            </form>
        </CustomDialog>
    )
}
