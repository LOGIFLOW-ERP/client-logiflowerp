import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomFullScreenDialog } from '@shared/ui-library'
import { useForm } from 'react-hook-form'
import { CreateWarehouseExitDTO, ScrapingSystem } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Box, Button, Chip, CircularProgress, Divider } from '@mui/material'
import {
    useAutomaticReplenishmentToaWarehouseExitMutation,
    useAutomaticReplenishmentWinWarehouseExitMutation,
    useCreateWarehouseExitMutation,
    useValidateWarehouseExitMutation
} from '@shared/api'
import { CabeceraForm } from './HeaderForm'
import { lazy, useState } from 'react'
import { usePermissions, useStore } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
const DetalleForm = lazy(() => import('./DetailForm').then(m => ({ default: m.DetalleForm })))
const DetailTable = lazy(() => import('./DetailTable').then(m => ({ default: m.DetailTable })))

const resolver = classValidatorResolver(CreateWarehouseExitDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function AddDialog(props: IProps) {

    const { open, setOpen } = props
    const { state: { selectedDocument }, setState } = useStore('warehouseExit')
    const [reposicion, setReposicion] = useState<null | ScrapingSystem>(null)
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        getValues
    } = useForm({ resolver, defaultValues: { ...selectedDocument } })
    const { enqueueSnackbar } = useSnackbar()
    const [canWarehouseExitValidateByID] = usePermissions([PERMISSIONS.PUT_WAREHOUSE_EXIT_VALIDATE_BY_ID])

    const [create, { isLoading }] = useCreateWarehouseExitMutation()
    const [createAutomaticReplenishmentToa, { isLoading: isLoadingAutomaticReplenishmentToa }] = useAutomaticReplenishmentToaWarehouseExitMutation()
    const [createAutomaticReplenishmentWin, { isLoading: isLoadingAutomaticReplenishmentWin }] = useAutomaticReplenishmentWinWarehouseExitMutation()
    const [validate, { isLoading: isLoadingValidate }] = useValidateWarehouseExitMutation()

    const onSubmit = async (data: CreateWarehouseExitDTO) => {
        try {
            let document
            switch (reposicion) {
                case null:
                    document = await create(data).unwrap()
                    break
                case ScrapingSystem.TOA:
                    document = await createAutomaticReplenishmentToa(data).unwrap()
                    break
                case ScrapingSystem.WIN:
                    document = await createAutomaticReplenishmentWin(data).unwrap()
                    break

                default:
                    throw new Error(`¡No hay casos para ${reposicion}!`)
            }

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
            title='Nueva salida de almacén'
            toolbar={
                (selectedDocument && canWarehouseExitValidateByID) ? (
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
                    isLoading={isLoading || isLoadingAutomaticReplenishmentToa || isLoadingAutomaticReplenishmentWin}
                    readOnly={!!selectedDocument}
                    register={register}
                    reposicion={reposicion}
                    setReposicion={setReposicion}
                    getValues={getValues}
                />
            </Box>
            {
                selectedDocument && (
                    <>
                        <Divider textAlign='left'>
                            <Chip label='Agregar Detalle' size='small' />
                        </Divider>
                        <DetalleForm />
                        {
                            !!selectedDocument.detail.length && (
                                <>
                                    <Divider textAlign='left'>
                                        <Chip label='Detalle' size='small' />
                                    </Divider>
                                    <DetailTable />
                                </>
                            )
                        }
                    </>
                )
            }
        </CustomFullScreenDialog>
    )
}
