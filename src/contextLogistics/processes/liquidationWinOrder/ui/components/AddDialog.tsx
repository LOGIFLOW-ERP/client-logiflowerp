import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomAutocomplete, CustomButtonSave, CustomDialog } from '@shared/ui-library'
import React, { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
    CreateInventoryDTO,
    EmployeeStockSerialENTITY,
    ProductOrderDTO,
    ProducType,
    WINOrderENTITY
} from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import {
    useAddInventoryWINOrderMutation,
    useGetDataLiquidationOrderEmployeeStockQuery
} from '@shared/api'
import TextField from '@mui/material/TextField'

const resolver = classValidatorResolver(CreateInventoryDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
}

export function AddDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
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

    const [addInventoryOrder, { isLoading }] = useAddInventoryWINOrderMutation()

    const onSubmit = async (data: CreateInventoryDTO) => {
        try {
            await addInventoryOrder({ _id: props.selectedRow._id, data }).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const code = useWatch({ control, name: "code" })
    const selectedProduct = dataES?.map(d => d.item).find((opt) => opt.itemCode === code)
    const isSerie = selectedProduct?.producType === ProducType.SERIE

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
            title={`AGREGAR - ${selectedRow.numero_de_peticion}`}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='code'
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete<ProductOrderDTO>
                            loading={isLoadingES}
                            options={dataES?.map(d => d.item) ?? []}
                            error={!!errors.code || isErrorES}
                            helperText={errors.code?.message || (errorES as Error)?.message}
                            value={dataES?.map(d => d.item).find((opt) => opt.itemCode === field.value) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue.itemCode : undefined)}
                            label='Producto'
                            getOptionLabel={(option) => `${option.itemCode} - ${option.itemName}`}
                            isOptionEqualToValue={(option, value) => option.itemCode === value.itemCode}
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
                                <CustomAutocomplete<Pick<EmployeeStockSerialENTITY, 'serial' | 'itemCode'>>
                                    loading={isLoadingES}
                                    options={dataES?.find((opt) => opt.item.itemCode === getValues('code'))?.serials ?? []}
                                    error={!!errors.invsn}
                                    helperText={errors.invsn?.message}
                                    value={dataES?.find((opt) => opt.item.itemCode === getValues('code'))?.serials?.find((opt) => opt.serial === field.value) || null}
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
