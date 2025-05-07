import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomDialogError, CustomDialogLoading, CustomSelect } from '@shared/ui-library'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { UpdateStoreDTO, getDataStoreType, StoreENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useUpdateStoreMutation } from '@shared/api'

const resolver = classValidatorResolver(UpdateStoreDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    row: StoreENTITY
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

    const onSubmit = async (data: UpdateStoreDTO) => {
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
            title={`EDITAR (${row.code})`}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
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
