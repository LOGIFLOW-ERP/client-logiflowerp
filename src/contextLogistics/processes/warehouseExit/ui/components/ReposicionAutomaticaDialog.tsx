import { Fallback } from '@app/ui/pages'
import { Button, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { PERMISSIONS } from '@shared/application'
import { usePermissions } from '@shared/ui/hooks'
import { CreateWarehouseExitDTO, EmployeeENTITY, getDataScrapingSystem, ScrapingSystem } from 'logiflowerp-sdk'
import { Dispatch, SetStateAction, Suspense, useEffect, useState } from 'react'
import { UseFormGetValues } from 'react-hook-form'

interface ReposicionAutomaticaDialogProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    selectedValue: ScrapingSystem | null
    setSelectedValue: Dispatch<SetStateAction<null | ScrapingSystem>>
    getValues: UseFormGetValues<CreateWarehouseExitDTO>
    dataPersonnel: EmployeeENTITY[]
}

function SimpleDialog(props: ReposicionAutomaticaDialogProps) {
    const { setOpen, open, setSelectedValue, getValues, dataPersonnel } = props
    const [personel, setPersonel] = useState(new EmployeeENTITY())
    const [
        canPOST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_TOA,
        canPOST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_WIN,
    ] = usePermissions([
        PERMISSIONS.POST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_TOA,
        PERMISSIONS.POST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_WIN,

    ])

    const handleClose = () => {
        setOpen(false)
    }

    const handleListItemClick = (value: ScrapingSystem | null) => {
        setSelectedValue(value)
        setOpen(false)
    }

    useEffect(() => {
        const personel = dataPersonnel.find(e => e.identity === getValues('carrier')?.identity)
        if (personel) {
            setPersonel(personel)
        }
    }, [dataPersonnel])

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Establecer sistema</DialogTitle>
            <List sx={{ pt: 0 }}>
                {
                    getDataScrapingSystem()
                        .filter(el => personel.resourceSystem.some(e => e.system === el.value))
                        .filter(el => canPOST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_TOA || el.value !== ScrapingSystem.TOA)
                        .filter(el => canPOST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_WIN || el.value !== ScrapingSystem.WIN)
                        .map((el) => (
                            <ListItem disablePadding key={el.value}>
                                <ListItemButton onClick={() => handleListItemClick(el.value)}>
                                    <ListItemText primary={el.label} />
                                </ListItemButton>
                            </ListItem>
                        ))
                }
                <ListItem disablePadding key={'ninguno'}>
                    <ListItemButton onClick={() => handleListItemClick(null)}>
                        <ListItemText primary='Ninguno' />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    )
}

export function ReposicionAutomaticaDialog(props: ReposicionAutomaticaDialogProps) {
    const { open, selectedValue, setOpen, setSelectedValue, getValues, dataPersonnel } = props
    return (
        <div style={{ width: '100%' }}>
            <Button
                variant='contained'
                onClick={() => setOpen(true)}
                size='medium'
                sx={{ width: '100%' }}
                color='secondary'
            >
                {selectedValue ? selectedValue : 'Reposición'}
            </Button>
            <Suspense fallback={<Fallback />}>
                {
                    open && (
                        <SimpleDialog
                            selectedValue={selectedValue}
                            open={open}
                            setOpen={setOpen}
                            setSelectedValue={setSelectedValue}
                            getValues={getValues}
                            dataPersonnel={dataPersonnel}
                        />
                    )
                }
            </Suspense>
        </div>
    )
}