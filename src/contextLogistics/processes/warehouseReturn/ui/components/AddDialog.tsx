import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomFullScreenDialog } from '@shared/ui-library'
import { useForm } from 'react-hook-form'
import { CreateWarehouseReturnDTO } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Box, Button, Chip, CircularProgress, Divider } from '@mui/material'
import {
    useCreateDraftWarehouseReturnMutation,
    useCreateWarehouseReturnMutation,
    useValidateWarehouseReturnMutation
} from '@shared/api'
import { CabeceraForm } from './HeaderForm'
import { lazy, Suspense } from 'react'
import { usePermissions, useResetApiState, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Fallback } from '@app/ui/pages'
const DetalleForm = lazy(() => import('./DetailForm').then(m => ({ default: m.DetalleForm })))
const DetailTable = lazy(() => import('./DetailTable').then(m => ({ default: m.DetailTable })))

const resolver = classValidatorResolver(CreateWarehouseReturnDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    isFetching: boolean
}

export function AddDialog(props: IProps) {

    const { open, setOpen, isFetching } = props
    const { state: { selectedDocument }, setState } = useStore('warehouseReturn')
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
    } = useForm({ resolver, defaultValues: { ...selectedDocument } })
    const { enqueueSnackbar } = useSnackbar()
    const resetApiState = useResetApiState()
    const [
        canValidateByID,
        canCreate
    ] = usePermissions([
        PERMISSIONS.PUT_WAREHOUSE_RETURN_VALIDATE_BY_ID,
        PERMISSIONS.POST_WAREHOUSE_RETURN
    ])

    const [create, { isLoading }] = canCreate
        ? useCreateWarehouseReturnMutation()
        : useCreateDraftWarehouseReturnMutation()
    const [validate, { isLoading: isLoadingValidate }] = useValidateWarehouseReturnMutation()

    const onSubmit = async (data: CreateWarehouseReturnDTO) => {
        try {
            const document = await create(data).unwrap()
            enqueueSnackbar({ message: '¡Creado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleValidateClick = async () => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            await validate(selectedDocument._id).unwrap()
            resetApiState(['employeeStockApi', 'warehouseStockApi'])
            setOpen(false)
            enqueueSnackbar({ message: '¡Validado correctamente!', variant: 'success' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <CustomFullScreenDialog
            open={open}
            setOpen={setOpen}
            title='Nueva devolución de almacén'
            toolbar={
                (!!selectedDocument && canValidateByID) ? (
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
                    isLoading={isLoading}
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
                            <DetalleForm />
                        </Suspense>
                        {
                            !!selectedDocument.detail.length && (
                                <Suspense fallback={<Fallback />}>
                                    <Divider textAlign='left'>
                                        <Chip label='Detalle' size='small' />
                                    </Divider>
                                    <DetailTable isFetching={isFetching || isLoadingValidate} />
                                </Suspense>
                            )
                        }
                    </>
                )
            }
        </CustomFullScreenDialog>
    )
}
