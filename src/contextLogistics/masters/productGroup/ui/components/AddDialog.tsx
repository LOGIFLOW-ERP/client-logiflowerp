import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog } from '@shared/ui-library'
import React from 'react'
import { useForm } from 'react-hook-form'
import { CreateProductGroupDTO } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useCreateProductGroupMutation } from '@shared/api'

const resolver = classValidatorResolver(CreateProductGroupDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function AddDialog(props: IProps) {

    const { open, setOpen } = props
    const {
        handleSubmit,
        formState: { errors },
        register
    } = useForm({ resolver, defaultValues: { _id: crypto.randomUUID() } })
    const { enqueueSnackbar } = useSnackbar()

    const [createProductGroup, { isLoading }] = useCreateProductGroupMutation()

    const onSubmit = async (data: CreateProductGroupDTO) => {
        try {
            await createProductGroup(data).unwrap()
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
            maxWidth='sm'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label='Código'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('itmsGrpCod')}
                    error={!!errors.itmsGrpCod}
                    helperText={errors.itmsGrpCod?.message}
                />
                <TextField
                    label='Nombre'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('itmsGrpNam')}
                    error={!!errors.itmsGrpNam}
                    helperText={errors.itmsGrpNam?.message}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
