import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomRichTreeView } from '@shared/ui-library'
import { useForm } from 'react-hook-form'
import { CreateProfileDTO, buildMenu } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useCreateProfileMutation } from '@shared/api'
import { useState } from 'react'
import { useStore } from '@shared/ui/hooks'

const resolver = classValidatorResolver(CreateProfileDTO)

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
    } = useForm({ resolver, defaultValues: { _id: crypto.randomUUID(), description: '', name: '', systemOptions: [] } })
    const { enqueueSnackbar } = useSnackbar()
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const { state: { dataSystemOptions } } = useStore('auth')
    const [create, { isLoading }] = useCreateProfileMutation()

    const onSubmit = async (data: CreateProfileDTO) => {
        try {
            data.systemOptions = selectedItems
            await create(data).unwrap()
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
                    label='Nombre'
                    autoFocus
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />
                <TextField
                    label='Descripción'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='small'
                    {...register('description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />
                <CustomRichTreeView
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    items={buildMenu(dataSystemOptions ?? [])}
                />
                <CustomButtonSave isLoading={isLoading} />
            </form>
        </CustomDialog>
    )
}
