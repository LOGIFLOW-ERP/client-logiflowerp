import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomAutocomplete, CustomButtonSave, CustomDialog, CustomMultipleSelectChip, CustomSelect } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CreateProductDTO, getDataProducType, ProductGroupENTITY, UnitOfMeasureENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useCreateProductMutation, useGetProductGroupsQuery, useGetUnitOfMeasuresQuery } from '@shared/api'
import { useGetDataScrapingSystem } from '@shared/ui/hooks'

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
    } = useForm({ resolver, defaultValues: { systems: [] } })
    const { enqueueSnackbar } = useSnackbar()
    const dataScrapingSystem = useGetDataScrapingSystem()

    const { data: dataUM, isError: isErrorUM, isLoading: isLoadingUM, error: errorUM } = useGetUnitOfMeasuresQuery()
    const { data: dataGroup, isError: isErrorGroup, isLoading: isLoadingGroup, error: errorGroup } = useGetProductGroupsQuery()
    const [createProduct, { isLoading }] = useCreateProductMutation()

    const onSubmit = async (data: CreateProductDTO) => {
        try {
            await createProduct(data).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
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
                <Controller
                    name='systems'
                    control={control}
                    render={({ field }) => (
                        <CustomMultipleSelectChip
                            label='Sistemas'
                            options={dataScrapingSystem.map((system) => system.value)}
                            value={field.value}
                            onChange={field.onChange}
                            isError={!!errors.systems}
                            helperText={errors.systems?.message}
                        />
                    )}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
