import { ColumnsPanelTrigger, FilterPanelTrigger, ToolbarButton } from '@mui/x-data-grid'
import { Badge, Tooltip } from '@mui/material'
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';

export function ToolbarButtonColumnsFilter() {

    return (
        <>
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
        </>
    )
}
