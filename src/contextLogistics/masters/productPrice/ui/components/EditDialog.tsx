import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomAutocomplete, CustomButtonSave, CustomDialog } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { UpdateProductPriceDTO, ProductPriceENTITY, currencies, CurrencyENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useUpdateProductPriceMutation } from '@shared/api'

const resolver = classValidatorResolver(UpdateProductPriceDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    row: ProductPriceENTITY
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

    const [updateProductPrice, { isLoading }] = useUpdateProductPriceMutation()

    const onSubmit = async (data: UpdateProductPriceDTO) => {
        try {
            await updateProductPrice({ id: row._id, data }).unwrap()
            enqueueSnackbar({ message: '¡Actualizado correctamente!', variant: 'success' })
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
            title={`EDITAR (${row.itemCode})`}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label='Precio'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    type="number"
                    slotProps={{
                        htmlInput: { step: 'any' },
                    }}
                    {...register('price', {
                        setValueAs: (v) =>
                            v === '' ? undefined : parseFloat(v.toString().replace(',', '.')),
                    })}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                />
                <Controller
                    name='currency'
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete<CurrencyENTITY>
                            loading={false}
                            options={currencies}
                            error={!!errors.currency}
                            helperText={errors.currency?.message}
                            value={currencies?.find((opt) => opt.code === field.value?.code) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue : undefined)}
                            label='Moneda'
                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                            isOptionEqualToValue={(option, value) => option.code === value.code}
                            margin='normal'
                        />
                    )}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
