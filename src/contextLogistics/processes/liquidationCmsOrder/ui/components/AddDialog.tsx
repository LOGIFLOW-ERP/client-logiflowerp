import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomAutocomplete, CustomButtonSave, CustomDialog } from '@shared/ui-library'
import React, { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { CreateInventoryDTO, EmployeeStockENTITY, EmployeeStockSerialENTITY, ProducType, TOAOrderENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { useAddInventoryWINOrderMutation, useGetDataLiquidationOrderEmployeeStockQuery } from '@shared/api'
import TextField from '@mui/material/TextField'

const resolver = classValidatorResolver(CreateInventoryDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: TOAOrderENTITY
}

export function AddDialog(props: IProps) {

    const { open, setOpen } = props
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        getValues,
        setValue,
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()

    const {
        data: dataES,
        isError: isErrorES,
        error: errorES,
        isLoading: isLoadingES
    } = useGetDataLiquidationOrderEmployeeStockQuery()

    const [_addInventoryTOAOrder, { isLoading }] = useAddInventoryWINOrderMutation()

    const onSubmit = async (_data: CreateInventoryDTO) => {
        try {
            // await addInventoryTOAOrder({ _id: props.selectedRow._id, data }).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const _id_stock = useWatch({ control, name: "_id_stock" })
    const selectedProduct = dataES?.map(d => d.item).find((opt) => opt.item.itemCode === _id_stock)
    const isSerie = selectedProduct?.item.producType === ProducType.SERIE

    useEffect(() => {
        if (!isSerie) {
            setValue('invsn', '')
            setValue('quantity', 0)
        } else {
            setValue('invsn', undefined as unknown as string)
            setValue('quantity', 1)
        }
    }, [isSerie, setValue])

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='AGREGAR'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='_id_stock'
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete<EmployeeStockENTITY>
                            loading={isLoadingES}
                            options={dataES?.map(d => d.item) ?? []}
                            error={!!errors._id_stock || isErrorES}
                            helperText={errors._id_stock?.message || (errorES as Error)?.message}
                            value={dataES?.map(d => d.item).find((opt) => opt._id === field.value) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue._id : undefined)}
                            label='Producto'
                            getOptionLabel={(option) => `${option.item.itemCode} - ${option.item.itemName} ${option.lot ? `- Lote: ${option.lot}` : ''}`.trim()}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            margin='dense'
                        />
                    )}
                />
                {
                    isSerie && (
                        <Controller
                            name='invsn'
                            control={control}
                            render={({ field }) => (
                                <CustomAutocomplete<EmployeeStockSerialENTITY>
                                    loading={isLoadingES}
                                    options={dataES?.find((opt) => opt.item._id === getValues('_id_stock'))?.serials ?? []}
                                    error={!!errors.invsn}
                                    helperText={errors.invsn?.message}
                                    value={dataES?.find((opt) => opt.item._id === getValues('_id_stock'))?.serials?.find((opt) => opt.serial === field.value) || null}
                                    onChange={(_, newValue) => field.onChange(newValue ? newValue.serial : undefined)}
                                    label='Serie'
                                    getOptionLabel={(option) => option.serial}
                                    isOptionEqualToValue={(option, value) => option.serial === value.serial}
                                    margin='dense'
                                />
                            )}
                        />
                    )
                }
                {
                    !isSerie && (
                        <TextField
                            label='Cantidad'
                            variant='outlined'
                            fullWidth
                            margin='dense'
                            size='small'
                            type="number"
                            slotProps={{
                                htmlInput: { step: 'any' },
                            }}
                            {...register('quantity', {
                                setValueAs: (v) =>
                                    v === '' ? undefined : parseFloat(v.toString().replace(',', '.')),
                            })}
                            error={!!errors.quantity}
                            helperText={errors.quantity?.message}
                        />
                    )
                }
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
