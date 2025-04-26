import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomDialogError, CustomSelect } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CreateProductDTO, getDataProducType } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useCreateProductMutation } from '@shared/api'

const resolver = classValidatorResolver(CreateProductDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function AddDialog(props: IProps) {

    const { open, setOpen } = props
    const {
        handleSubmit,
        formState: { errors },
        register,
        control
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()


    const [createProduct, { isLoading, isError }] = useCreateProductMutation()

    const onSubmit = async (data: CreateProductDTO) => {
        try {
            await createProduct(data).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isError) return <CustomDialogError open={open} setOpen={setOpen} />

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='AGREGAR'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label='Código'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('itemCode')}
                    error={!!errors.itemCode}
                    helperText={errors.itemCode?.message}
                />
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
                    name='productype'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='Tipo Prod'
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
                <TextField
                    label='Grupo'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('itmsGrpCod')}
                    error={!!errors.itmsGrpCod}
                    helperText={errors.itmsGrpCod?.message}
                />
                <TextField
                    label='Min'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    type="number"
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                    {...register('minLevel')}
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
                        inputLabel: {
                            shrink: true
                        }
                    }}
                    {...register('maxLevel')}
                    error={!!errors.maxLevel}
                    helperText={errors.maxLevel?.message}
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
