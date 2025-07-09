import { DataGrid, GridValidRowModel } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { getColumns } from './columns'


interface GenericDataGridProps<T> {
    rows: T[]
    getRowId: (row: T) => string | number
    actions?: {
        onEdit?: (row: T) => void
        onDelete?: (row: T) => void
        onView?: (row: T) => void
    }
    excludeFields?: string[]
    renameHeaders?: Record<string, string>
    loading?: boolean
    height?: number
}

export function GenericDataGrid<T extends GridValidRowModel>({
    rows,
    getRowId,
    actions,
    excludeFields = [],
    renameHeaders = {},
    loading = false,
    height = 400
}: GenericDataGridProps<T>) {
    return (
        <Box sx={{ height, width: '100%' }}>
            <DataGrid<T>
                rows={rows}
                columns={getColumns({ actions, entityInstance: rows[0], excludeFields, renameHeaders })}
                getRowId={getRowId}
                loading={loading}
                disableRowSelectionOnClick
            />
        </Box>
    )
}

