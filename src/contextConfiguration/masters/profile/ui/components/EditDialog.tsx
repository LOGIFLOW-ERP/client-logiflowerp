import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomButtonSave, CustomDialog, CustomRichTreeView } from '@shared/ui-library'
import { useForm } from 'react-hook-form'
import { buildMenu, UpdateProfileDTO, ProfileENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { TextField } from '@mui/material'
import { useUpdateProfileMutation } from '@shared/api'
import { useEffect, useState } from 'react'
import { useStore } from '@shared/ui/hooks'

const resolver = classValidatorResolver(UpdateProfileDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    row: ProfileENTITY
}

export function EditDialog(props: IProps) {

    const { open, setOpen, row } = props
    const {
        handleSubmit,
        formState: { errors },
        register
    } = useForm({ resolver, defaultValues: { ...row } })
    const { enqueueSnackbar } = useSnackbar()
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const { state: { dataSystemOptions } } = useStore('auth')
    const [update, { isLoading }] = useUpdateProfileMutation()
    useEffect(() => setSelectedItems(row.systemOptions), [row])

    const onSubmit = async (data: UpdateProfileDTO) => {
        try {
            data.systemOptions = selectedItems
            await update({ id: row._id, data }).unwrap()
            enqueueSnackbar({ message: 'Actualizado correctamente!', variant: 'success' })
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
            title={`EDITAR (${row.name})`}
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
