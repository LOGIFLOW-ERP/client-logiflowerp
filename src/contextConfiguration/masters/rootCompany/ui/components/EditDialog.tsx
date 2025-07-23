import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomDialog, CustomDialogError, CustomDialogLoading, CustomRichTreeView } from '@shared/ui-library'
import { useForm } from 'react-hook-form'
import { buildMenu, UpdateRootCompanyDTO, RootCompanyENTITY, ScrapingCredentialDTO } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { Button, CircularProgress, IconButton, TextField, Tooltip } from '@mui/material'
import { useGetSystemOptionsPipelineQuery, useUpdateRootCompanyMutation } from '@shared/api'
import { lazy, useEffect, useState } from 'react'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { GridRowModel } from '@mui/x-data-grid'
const ScrapingTargetsDialog = lazy(() => import('./ScrapingTargetsDialog').then(m => ({ default: m.ScrapingTargetsDialog })))

const resolver = classValidatorResolver(UpdateRootCompanyDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    row: RootCompanyENTITY
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
    const [scrapingTargets, setScrapingTargets] = useState<readonly GridRowModel[]>([])
    const [openScrapingTargetsDialog, setOpenScrapingTargetsDialog] = useState(false)
    const filtersSystemOptions = [{ $match: { root: false } }]
    const { data: dataSystemOptions, error: errorSystemOptions, isLoading: isLoadingSystemOptions } = useGetSystemOptionsPipelineQuery(filtersSystemOptions)
    const [update, { isLoading }] = useUpdateRootCompanyMutation()
    useEffect(() => {
        setSelectedItems(row.systemOptions)
        setScrapingTargets(row.scrapingTargets)
    }, [row])

    const onSubmit = async (data: UpdateRootCompanyDTO) => {
        try {
            data.systemOptions = selectedItems
            data.scrapingTargets = [...(scrapingTargets as ScrapingCredentialDTO[])]
            await update({ id: row._id, data }).unwrap()
            enqueueSnackbar({ message: '¡Actualizado correctamente!', variant: 'success' })
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
                title={`EDITAR (${row.companyname})`}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
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
