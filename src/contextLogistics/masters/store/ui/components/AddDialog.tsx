import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomSelect, CustomSelectDto } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CreateStoreDTO, getDataStoreType, State } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useCreateStoreMutation, useGetCompaniesPipelineQuery } from '@shared/api'

const resolver = classValidatorResolver(CreateStoreDTO)

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

    const pipelineCompanies = [{ $match: { state: State.ACTIVO } }]
    const { data: dataCompanies, isError: isErrorCompanies, isLoading: isLoadingCompanies } = useGetCompaniesPipelineQuery(pipelineCompanies)

    const [createStore, { isLoading }] = useCreateStoreMutation()

    const onSubmit = async (data: CreateStoreDTO) => {
        try {
            await createStore(data).unwrap()
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
                <Controller
                    name='company'
                    control={control}
                    render={({ field }) => (
                        <CustomSelectDto
                            label='Empresa'
                            options={dataCompanies ?? []}
                            {...field}
                            labelKey='companyname'
                            valueKey='code'
                            margin='normal'
                            error={!!errors.company}
                            helperText={errors.company?.message}
                            isLoading={isLoadingCompanies}
                            isError={isErrorCompanies}
                        />
                    )}
                />
                <TextField
                    label='Código'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('code')}
                    error={!!errors.code}
                    helperText={errors.code?.message}
                />
                <TextField
                    label='Nombre'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />
                <TextField
                    label='Dirección'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                />
                <TextField
                    label='Ubicación'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('location')}
                    error={!!errors.location}
                    helperText={errors.location?.message}
                />
                <TextField
                    label='Capacidad'
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
                    {...register('storagecapacity')}
                    error={!!errors.storagecapacity}
                    helperText={errors.storagecapacity?.message}
                />
                <Controller
                    name='storetype'
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label='Tipo'
                            options={getDataStoreType()}
                            {...field}
                            labelKey='label'
                            valueKey='value'
                            margin='normal'
                            error={!!errors.storetype}
                            helperText={errors.storetype?.message}
                        />
                    )}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
