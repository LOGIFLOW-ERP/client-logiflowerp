import { CustomDialog, CustomFileExplorer } from '@shared/ui-library'
import React from 'react'
import { InventoryWinDTO, StateInternalOrderWin, WINOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { columnsInventory } from '../GridCol/columnsInventory'
import { useGridApiRef } from '@mui/x-data-grid'
import { Box, Button, CircularProgress, Tooltip } from '@mui/material'
import { modelDocumentationLiquidationOrderWin } from '@shared/application/constants'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { useFinalizeOrderWinOrderMutation } from '@shared/infrastructure/redux/api'
import { useSnackbar } from 'notistack'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
}

export function InventoryDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()
    const [finalizeOrder, { isLoading }] = useFinalizeOrderWinOrderMutation()
    const { enqueueSnackbar } = useSnackbar()

    const handleFinalizeOrderClick = async () => {
        try {
            await finalizeOrder(selectedRow._id).unwrap()
            setOpen(false)
            enqueueSnackbar({ message: '¡Orden finalizada!', variant: 'success' })
        } catch (error) {
            console.log(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Inventario'
            maxWidth='md'
            slotProps={{
                transition: {
                    onEntered: () => {
                        apiRef.current?.autosizeColumns({
                            includeHeaders: true,
                            includeOutliers: true,
                        })
                    }
                }
            }}
        >
            <Box component={'div'} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box
                    component='div'
                    sx={{
                        display: 'flex',
                        gap: 4
                    }}
                >
                    <Box
                        sx={{
                            flex: 10,
                            overflow: 'auto',
                        }}
                    >
                        <CustomFileExplorer
                            model={modelDocumentationLiquidationOrderWin}
                            files={selectedRow.fotos}
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}
                    >
                        {
                            selectedRow.estado_interno === StateInternalOrderWin.REVISION
                                ? <Tooltip title='Finalizar orden'>
                                    <Button
                                        variant='contained'
                                        color='success'
                                        sx={{ width: '100%' }}
                                        loading={isLoading}
                                        loadingIndicator={<CircularProgress size={24} color='inherit' />}
                                        loadingPosition='center'
                                        size='small'
                                        startIcon={<BookmarkAddedIcon fontSize='small' />}
                                        onClick={handleFinalizeOrderClick}
                                    >
                                        FINALIZAR
                                    </Button>
                                </Tooltip>
                                : null
                        }
                    </Box>
                </Box>

                <DataGrid<InventoryWinDTO>
                    rows={selectedRow.inventory}
                    columns={columnsInventory()}
                    disableRowSelectionOnClick
                    showToolbar
                    getRowId={row => `${row.code}${row.invsn}`}
                    density='compact'
                    apiRef={apiRef}
                />
            </Box>
        </CustomDialog>
    )
}
