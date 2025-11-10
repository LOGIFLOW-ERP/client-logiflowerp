import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomAutocomplete, CustomButtonSave, CustomDialog } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CreateProductPriceDTO, currencies, CurrencyENTITY, ProductENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useCreateProductPriceMutation } from '@shared/api'

const resolver = classValidatorResolver(CreateProductPriceDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    dataProducts: ProductENTITY[]
}

export function AddDialog(props: IProps) {

    const { open, setOpen, dataProducts = [] } = props
    const {
        handleSubmit,
        formState: { errors },
        register,
        control
    } = useForm({ resolver, defaultValues: { _id: crypto.randomUUID() } })
    const { enqueueSnackbar } = useSnackbar()

    const [createProductPrice, { isLoading }] = useCreateProductPriceMutation()

    const onSubmit = async (data: CreateProductPriceDTO) => {
        try {
            await createProductPrice(data).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
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
            title='AGREGAR'
            maxWidth='sm'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='itemCode'
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete<ProductENTITY>
                            loading={false}
                            options={dataProducts}
                            error={!!errors.itemCode}
                            helperText={errors.itemCode?.message}
                            value={dataProducts?.find((opt) => opt.itemCode === field.value) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue.itemCode : undefined)}
                            label='Producto'
                            getOptionLabel={(option) => `${option.itemCode} - ${option.itemName}`}
                            isOptionEqualToValue={(option, value) => option.itemCode === value.itemCode}
                            margin='normal'
                        />
                    )}
                />
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
