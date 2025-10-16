import { Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { Box, CircularProgress, ClickAwayListener, Divider, Paper, Popper, Stack, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Dispatch, SetStateAction, Suspense, useRef, useState } from 'react'
import { ToolbarButtonExportSearch } from '../components/ToolbarButtonExportSearch';
import { ToolbarButtonColumnsFilter } from '../components/ToolbarButtonColumnsFilter';

interface IProps {
    setOpenAdd?: Dispatch<SetStateAction<boolean>>
    AGREGAR_NUEVO_REGISTRO: boolean
    customInputFileUpload1?: React.ReactNode
    children?: React.ReactNode;
    handleAddClick?: () => void
}

export function CustomToolbar(props: IProps) {
    const {
        setOpenAdd,
        AGREGAR_NUEVO_REGISTRO,
        customInputFileUpload1,
        children,
        handleAddClick
    } = props

    const [filtersPanelOpen, setFiltersPanelOpen] = useState(false)
    const newPanelTriggerRef = useRef<HTMLButtonElement>(null)

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setFiltersPanelOpen(false)
        }
    }

    return (
        <Toolbar>
            {
                AGREGAR_NUEVO_REGISTRO && (
                    <Tooltip title="Agregar nuevo registro">
                        <ToolbarButton
                            aria-describedby="new-panel-add"
                            onClick={() => {
                                if (setOpenAdd) {
                                    setOpenAdd(true)
                                }
                                if (handleAddClick) {
                                    handleAddClick()
                                }
                            }}
                        >
                            <AddIcon fontSize="small" color='success' />
                        </ToolbarButton>
                    </Tooltip>
                )
            }
            {
                customInputFileUpload1
                    ? customInputFileUpload1
                    : null
            }

            <Box sx={{ flexGrow: 1 }} />


            <ToolbarButtonColumnsFilter />

            {
                children && (
                    <>
                        <Tooltip title="Filtrar en base de datos">
                            <ToolbarButton
                                ref={newPanelTriggerRef}
                                aria-describedby="new-panel"
                                onClick={() => setFiltersPanelOpen((prev) => !prev)}
                            >
                                <FilterAltIcon fontSize="small" color='primary' />
                            </ToolbarButton>
                        </Tooltip>

                        <Popper
                            open={filtersPanelOpen}
                            anchorEl={newPanelTriggerRef.current}
                            placement="bottom-end"
                            id="new-panel"
                            onKeyDown={handleKeyDown}
                        >
                            <ClickAwayListener onClickAway={() => setFiltersPanelOpen(false)}>
                                <Paper
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        width: 300,
                                        p: 2,
                                    }}
                                    elevation={8}
                                >
                                    {/* <Box component='form' onSubmit={handleFormSubmit}> */}
                                    <Stack spacing={2}>
                                        <Suspense
                                            fallback={
                                                <CircularProgress
                                                    size='30px'
                                                    sx={{ alignSelf: 'center' }}
                                                    color='secondary'
                                                />
                                            }
                                        >
                                            {children}
                                        </Suspense>
                                        {/* <Button type='submit' variant='contained' fullWidth>
                                                Buscar
                                            </Button> */}
                                    </Stack>
                                    {/* </Box> */}
                                </Paper>
                            </ClickAwayListener>
                        </Popper>
                    </>
                )
            }

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <ToolbarButtonExportSearch />
        </Toolbar>
    )
}
