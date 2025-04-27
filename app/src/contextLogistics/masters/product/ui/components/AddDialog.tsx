import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomDialogError, CustomDialogLoading, CustomSelect } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CreateProductDTO, getDataProducType } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useCreateProductMutation, useGetProductGroupsQuery, useGetUnitOfMeasuresQuery } from '@shared/api'

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

    const { data: dataUM, isError: isErrorUM, isLoading: isLoadingUM } = useGetUnitOfMeasuresQuery()
    const { data: dataGroup, isError: isErrorGroup, isLoading: isLoadingGroup } = useGetProductGroupsQuery()
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

    if (isError || isErrorUM || isErrorGroup) return <CustomDialogError open={open} setOpen={setOpen} />
    if (isLoading || isLoadingUM || isLoadingGroup) return <CustomDialogLoading open={open} setOpen={setOpen} />

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
                    name='producType'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='Tipo Prod'
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
                <Controller
                    name='uomCode'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='UM'
                            options={dataUM ?? []}
                            {...field}
                            labelKey='uomCode'
                            valueKey='uomCode'
                            margin='normal'
                            error={!!errors.uomCode}
                            helperText={errors.uomCode?.message}
                        />
                    )}
                />
                <Controller
                    name='itmsGrpCod'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='Grupo'
                            options={dataGroup ?? []}
                            {...field}
                            labelKey='itmsGrpCod'
                            valueKey='itmsGrpCod'
                            margin='normal'
                            error={!!errors.itmsGrpCod}
                            helperText={errors.itmsGrpCod?.message}
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
