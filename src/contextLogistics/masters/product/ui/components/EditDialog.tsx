import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomAutocomplete, CustomButtonSave, CustomDialog } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { UpdateProductDTO, ProductENTITY, ProductGroupENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useGetProductGroupsQuery, useUpdateProductMutation } from '@shared/api'

const resolver = classValidatorResolver(UpdateProductDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    row: ProductENTITY
}

export function EditDialog(props: IProps) {

    const { open, setOpen, row } = props
    const {
        handleSubmit,
        formState: { errors },
        register,
        control
    } = useForm({ resolver, defaultValues: row })
    const { enqueueSnackbar } = useSnackbar()

    const { data: dataGroup, isError: isErrorGroup, isLoading: isLoadingGroup, error: errorGroup } = useGetProductGroupsQuery()
    const [updateStore, { isLoading }] = useUpdateProductMutation()

    const onSubmit = async (data: UpdateProductDTO) => {
        try {
            await updateStore({ id: row._id, data }).unwrap()
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
            title={`EDITAR (${row.itemCode})`}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label='Nombre'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('itemName')}
                    error={!!errors.itemName}
                    helperText={errors.itemName?.message}
                />
                <Controller
                    name='itmsGrpCod'
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete<ProductGroupENTITY>
                            loading={isLoadingGroup}
                            options={dataGroup}
                            error={!!errors.itmsGrpCod || isErrorGroup}
                            helperText={errors.itmsGrpCod?.message || (errorGroup as Error)?.message}
                            value={dataGroup?.find((opt) => opt.itmsGrpCod === field.value) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue.itmsGrpCod : undefined)}
                            label='Grupo'
                            getOptionLabel={(option) => `${option.itmsGrpCod} - ${option.itmsGrpNam}`}
                            isOptionEqualToValue={(option, value) => option.itmsGrpCod === value.itmsGrpCod}
                        />
                    )}
                />
                <TextField
                    label='Min'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    type="number"
                    slotProps={{
                        htmlInput: { step: 'any' },
                    }}
                    {...register('minLevel', {
                        setValueAs: (v) =>
                            v === '' ? undefined : parseFloat(v.toString().replace(',', '.')),
                    })}
                    error={!!errors.minLevel}
                    helperText={errors.minLevel?.message}
                />
                <TextField
                    label='Max'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    type="number"
                    slotProps={{
                        htmlInput: { step: 'any' },
                    }}
                    {...register('maxLevel', {
                        setValueAs: (v) =>
                            v === '' ? undefined : parseFloat(v.toString().replace(',', '.')),
                    })}
                    error={!!errors.maxLevel}
                    helperText={errors.maxLevel?.message}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
