import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomSelect } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CreateStoreDTO, getDataStoreType } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useCreateStoreMutation } from '@shared/api'

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
        register, control
    } = useForm({ resolver, defaultValues: { ...new CreateStoreDTO(), _id: crypto.randomUUID() } })
    const { enqueueSnackbar } = useSnackbar()
    const [createStore, { isLoading }] = useCreateStoreMutation()

    const onSubmit = async (data: CreateStoreDTO) => {
        try {
            await createStore(data).unwrap()
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
                    autoFocus
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
