import { ColumnsPanelTrigger, FilterPanelTrigger, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { Badge, Box, CircularProgress, ClickAwayListener, Paper, Popper, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Dispatch, SetStateAction, Suspense, useRef, useState } from 'react'

interface IProps {
    setOpenAdd: Dispatch<SetStateAction<boolean>>
    AGREGAR_NUEVO_REGISTRO: boolean
    children?: React.ReactNode;
}

export function CustomToolbar({ setOpenAdd, AGREGAR_NUEVO_REGISTRO, children }: IProps) {

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
                            onClick={() => setOpenAdd(true)}
                        >
                            <AddIcon fontSize="small" color='success' />
                        </ToolbarButton>
                    </Tooltip>
                )
            }
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Columnas">
                <ColumnsPanelTrigger render={<ToolbarButton />}>
                    <ViewColumnIcon fontSize="small" />
                </ColumnsPanelTrigger>
            </Tooltip>

            <Tooltip title="Filtrar en tabla">
                <FilterPanelTrigger
                    render={(props, state) => (
                        <ToolbarButton {...props} color="default">
                            <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                                <FilterListIcon fontSize="small" />
                            </Badge>
                        </ToolbarButton>
                    )}
                />
            </Tooltip>

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
                                </Paper>
                            </ClickAwayListener>
                        </Popper>
                    </>
                )
            }
        </Toolbar>
    )
}
