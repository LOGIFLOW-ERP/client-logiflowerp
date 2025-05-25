import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomSelect } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CreateProductDTO, getDataProducType } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
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
    const [createProduct, { isLoading }] = useCreateProductMutation()

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
                            isLoading={isLoadingUM}
                            isError={isErrorUM}
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
                            isLoading={isLoadingGroup}
                            isError={isErrorGroup}
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
                    {...register('minLevel', { valueAsNumber: true })}
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
                    {...register('maxLevel', { valueAsNumber: true })}
                    error={!!errors.maxLevel}
                    helperText={errors.maxLevel?.message}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
