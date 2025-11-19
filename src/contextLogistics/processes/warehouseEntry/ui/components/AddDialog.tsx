import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomFullScreenDialog } from '@shared/ui-library'
import { useForm } from 'react-hook-form'
import { CreateWarehouseEntryDTO } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Box, Button, Chip, CircularProgress, Divider } from '@mui/material'
import {
    useCreateWarehouseEntryMutation,
    useValidateWarehouseEntryMutation
} from '@shared/api'
import { CabeceraForm } from './HeaderForm'
import { lazy, Suspense } from 'react'
import { DetalleTable } from './DetailTable'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const DetalleForm = lazy(() => import('./DetailForm').then(m => ({ default: m.DetalleForm })))

const resolver = classValidatorResolver(CreateWarehouseEntryDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    isFetching: boolean
}

export function AddDialog(props: IProps) {

    const { open, setOpen, isFetching } = props
    const { state: { selectedDocument }, setState } = useStore('warehouseEntry')
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
    } = useForm({ resolver, defaultValues: { ...selectedDocument } })
    const { enqueueSnackbar } = useSnackbar()
    const [canWarehouseEntryValidateByID] = usePermissions([PERMISSIONS.PUT_WAREHOUSE_ENTRY_VALIDATE_BY_ID])

    const [create, { isLoading }] = useCreateWarehouseEntryMutation()
    const [validate, { isLoading: isLoadingValidate }] = useValidateWarehouseEntryMutation()

    const onSubmit = async (data: CreateWarehouseEntryDTO) => {
        try {
            const document = await create(data).unwrap()
            enqueueSnackbar({ message: '¡Creado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleValidateClick = async () => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            await validate(selectedDocument._id).unwrap()
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
                (selectedDocument && canWarehouseEntryValidateByID) ? (
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
            <Divider textAlign='left'>
                <Chip label='Datos Principales' size='small' />
            </Divider>
            <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} padding={1}>
                <CabeceraForm
                    control={control}
                    errors={errors}
                    isLoading={isLoading || isFetching}
                    readOnly={!!selectedDocument}
                    register={register}
                />
            </Box>
            {
                selectedDocument && (
                    <>
                        <Divider textAlign='left'>
                            <Chip label='Agregar Detalle' size='small' />
                        </Divider>
                        <Suspense fallback={<Fallback />}>
                            <DetalleForm setOpen={setOpen} isFetching={isFetching || isLoadingValidate} />
                        </Suspense>
                        {
                            !!selectedDocument.detail.length && (
                                <>
                                    <Divider textAlign='left'>
                                        <Chip label='Detalle' size='small' />
                                    </Divider>
                                    <DetalleTable isFetching={isFetching || isLoadingValidate} />
                                </>
                            )
                        }
                    </>
                )
            }
        </CustomFullScreenDialog>
    )
}
