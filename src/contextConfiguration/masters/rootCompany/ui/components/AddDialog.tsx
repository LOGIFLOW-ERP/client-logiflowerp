import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomDialogError, CustomDialogLoading, CustomRichTreeView, CustomSelect } from '@shared/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { CreateRootCompanyPERDTO, dataCountry, State, buildMenu, ScrapingCredentialDTO } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, IconButton, TextField, Tooltip } from '@mui/material'
import { useCreateRootCompanyMutation, useGetSystemOptionsPipelineQuery } from '@shared/api'
import { lazy, useState } from 'react'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { GridRowModel } from '@mui/x-data-grid'
const ScrapingTargetsDialog = lazy(() => import('./ScrapingTargetsDialog').then(m => ({ default: m.ScrapingTargetsDialog })))

const resolver = classValidatorResolver(CreateRootCompanyPERDTO)

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
    } = useForm({ resolver, defaultValues: { ...new CreateRootCompanyPERDTO(), country: 'PER' } })
    const { enqueueSnackbar } = useSnackbar()
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [scrapingTargets, setScrapingTargets] = useState<readonly GridRowModel[]>([])
    const [openScrapingTargetsDialog, setOpenScrapingTargetsDialog] = useState(false)
    const filtersSystemOptions = [{ $match: { root: false } }]
    const { data: dataSystemOptions, error: errorSystemOptions, isLoading: isLoadingSystemOptions } = useGetSystemOptionsPipelineQuery(filtersSystemOptions)
    const [create, { isLoading }] = useCreateRootCompanyMutation()

    const onSubmit = async (data: CreateRootCompanyPERDTO) => {
        try {
            data.systemOptions = selectedItems
            data.scrapingTargets = [...(scrapingTargets as ScrapingCredentialDTO[])]
            await create(data).unwrap()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
            setOpen(false)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isLoadingSystemOptions) return <CustomDialogLoading open={open} setOpen={setOpen} />
    if (errorSystemOptions) return <CustomDialogError open={open} setOpen={setOpen} />

    return (
        <>
            <CustomDialog
                open={open}
                setOpen={setOpen}
                title='AGREGAR'
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name='country'
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                label='País'
                                options={dataCountry.filter(e => e.estado === State.ACTIVO)}
                                {...field}
                                labelKey='nombre'
                                valueKey='alfa3'
                                margin='normal'
                                error={!!errors.country}
                                helperText={errors.country?.message}
                            />
                        )}
                    />
                    <TextField
                        label='RUC'
                        autoFocus
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        size='small'
                        {...register('ruc')}
                        error={!!errors.ruc}
                        helperText={errors.ruc?.message}
                    />
                    <TextField
                        label='Correo electrónico'
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        size='small'
                        {...register('email')}
                        autoComplete='email'
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        label='Teléfono'
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        size='small'
                        {...register('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                    />
                    <TextField
                        label='Sitio web'
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        size='small'
                        {...register('website')}
                        error={!!errors.website}
                        helperText={errors.website?.message}
                    />
                    <TextField
                        label='ID Gerente'
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        size='small'
                        {...register('identityManager')}
                        error={!!errors.identityManager}
                        helperText={errors.identityManager?.message}
                    />
                    <Tooltip title='Scraping targets'>
                        <IconButton
                            color='primary'
                            aria-label='add scraping targets'
                            onClick={() => setOpenScrapingTargetsDialog(true)}
                        >
                            <DisplaySettingsIcon />
                        </IconButton>
                    </Tooltip>
                    <CustomRichTreeView
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        items={buildMenu(dataSystemOptions ?? [])}
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
            {
                openScrapingTargetsDialog && (
                    <ScrapingTargetsDialog
                        open={openScrapingTargetsDialog}
                        setOpen={setOpenScrapingTargetsDialog}
                        scrapingTargets={scrapingTargets}
                        setScrapingTargets={setScrapingTargets}
                    />
                )
            }
        </>
    )
}
