import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomRichTreeView, CustomSelect, CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { buildMenu, UpdateRootCompanyDTO, getDataSupplier, RootCompanyENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useGetSystemOptionsPipelineQuery, useUpdateRootCompanyMutation } from '@shared/api'
import { useEffect, useState } from 'react'

const resolver = classValidatorResolver(UpdateRootCompanyDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    row: RootCompanyENTITY
}

export function EditDialog(props: IProps) {

    const { open, setOpen, row } = props
    const {
        handleSubmit,
        formState: { errors },
        register, control
    } = useForm({ resolver, defaultValues: { ...row } })
    const { enqueueSnackbar } = useSnackbar()
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const filtersSystemOptions = [{ $match: { root: false } }]
    const { data: dataSystemOptions, error: errorSystemOptions, isLoading: isLoadingSystemOptions } = useGetSystemOptionsPipelineQuery(filtersSystemOptions)
    const [update, { isLoading }] = useUpdateRootCompanyMutation()
    useEffect(() => setSelectedItems(row.systemOptions), [row])

    const onSubmit = async (data: UpdateRootCompanyDTO) => {
        try {
            data.systemOptions = selectedItems
            await update({ id: row._id, data }).unwrap()
            enqueueSnackbar({ message: 'Actualizado correctamente!', variant: 'success' })
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
                <TextField
                    label='ID Gerente'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('identityManager')}
                    error={!!errors.identityManager}
                    helperText={errors.identityManager?.message}
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
