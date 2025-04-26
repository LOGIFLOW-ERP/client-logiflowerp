import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomDialogError, CustomDialogLoading, CustomSelect } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { UpdateProductDTO, getDataProducType, ProductENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useUpdateStoreMutation } from '@shared/api'

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

    const [updateStore, { isLoading, isError }] = useUpdateStoreMutation()

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

    if (isLoading) return <CustomDialogLoading open={open} setOpen={setOpen} />
    if (isError) return <CustomDialogError open={open} setOpen={setOpen} />

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
                <TextField
                    label='UM'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('uomCode')}
                    error={!!errors.uomCode}
                    helperText={errors.uomCode?.message}
                />
                <Controller
                    name='productype'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='Tipo'
                            options={getDataProducType()}
                            {...field}
                            labelKey='label'
                            valueKey='value'
                            margin='normal'
                            error={!!errors.productype}
                            helperText={errors.productype?.message}
                        />
                    )}
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
