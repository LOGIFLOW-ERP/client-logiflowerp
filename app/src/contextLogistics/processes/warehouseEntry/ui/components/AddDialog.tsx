import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomFullScreenDialog } from '@shared/ui-library'
import { useForm } from 'react-hook-form'
import { CreateWarehouseEntryDTO, WarehouseEntryENTITY } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Box, Button, CircularProgress } from '@mui/material'
import { useCreateWarehouseEntryMutation, useValidateWarehouseEntryMutation } from '@shared/api'
import { CabeceraForm } from './CabeceraForm'

const resolver = classValidatorResolver(CreateWarehouseEntryDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WarehouseEntryENTITY | undefined
    setSelectedRow: React.Dispatch<React.SetStateAction<WarehouseEntryENTITY | undefined>>
}

export function AddDialog(props: IProps) {

    const { open, setOpen, selectedRow, setSelectedRow } = props
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
    } = useForm({ resolver, defaultValues: { ...selectedRow } })
    const { enqueueSnackbar } = useSnackbar()

    const [create, { isLoading }] = useCreateWarehouseEntryMutation()
    const [validate, { isLoading: isLoadingValidate }] = useValidateWarehouseEntryMutation()

    const onSubmit = async (data: CreateWarehouseEntryDTO) => {
        try {
            const newDoc = await create(data).unwrap()
            enqueueSnackbar({ message: '¡Creado correctamente!', variant: 'success' })
            setSelectedRow(newDoc)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleValidateClick = async () => {
        try {
            if (!selectedRow) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            await validate(selectedRow._id).unwrap()
            setOpen(false)
            enqueueSnackbar({ message: '¡Validado correctamente!', variant: 'success' })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <CustomFullScreenDialog
            open={open}
            setOpen={setOpen}
            title='Nuevo ingreso de almacén'
            toolbar={
                selectedRow ? (
                    <Button
                        variant='contained'
                        color='success'
                        sx={{ marginTop: 1 }}
                        loading={isLoadingValidate}
                        loadingIndicator={<CircularProgress size={24} color='inherit' />}
                        loadingPosition='center'
                        onClick={handleValidateClick}
                    >
                        validar
                    </Button>
                )
                    : null
            }
        >
            <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} padding={1}>
                <CabeceraForm
                    control={control}
                    errors={errors}
                    isLoading={isLoading}
                    readOnly={!!selectedRow}
                    register={register}
                />
            </Box>
        </CustomFullScreenDialog>
    )
}
