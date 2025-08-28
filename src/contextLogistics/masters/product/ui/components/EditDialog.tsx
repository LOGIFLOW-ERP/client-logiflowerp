import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomAutocomplete, CustomButtonSave, CustomDialog, CustomSelect } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { UpdateProductDTO, getDataProducType, ProductENTITY, UnitOfMeasureENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useGetUnitOfMeasuresQuery, useUpdateProductMutation } from '@shared/api'

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

    const { data: dataUM, isLoading: isLoadingUM, isError: isErrorUM, error: errorUM } = useGetUnitOfMeasuresQuery()
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
                    name='uomCode'
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete<UnitOfMeasureENTITY>
                            loading={isLoadingUM}
                            options={dataUM}
                            error={!!errors.uomCode || isErrorUM}
                            helperText={errors.uomCode?.message || (errorUM as Error)?.message}
                            value={dataUM?.find((opt) => opt.uomCode === field.value) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue.uomCode : undefined)}
                            label='UM'
                            getOptionLabel={(option) => `${option.uomCode} - ${option.uomName}`}
                            isOptionEqualToValue={(option, value) => option.uomCode === value.uomCode}
                        />
                    )}
                />
                <Controller
                    name='producType'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='Tipo'
                            options={getDataProducType()}
                            {...field}
                            labelKey='label'
                            valueKey='value'
                            margin='normal'
                            error={!!errors.producType}
                            helperText={errors.producType?.message}
                        />
                    )}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
