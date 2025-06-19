import EditIcon from '@mui/icons-material/Edit'
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
import { WarehouseStockENTITYFlat } from 'logiflowerp-sdk'

interface IParams<T> {
    handleEditClick: (row: T) => void
}

export function generateColumnsFromEntity<T extends Record<string, any>>(
    exampleEntity: T,
    options?: IParams<T> & { includeActions?: boolean }
): GridColDef<T>[] {
    const cols: GridColDef<T>[] = Object.entries(exampleEntity).map(([key, value]) => {
        const lowerKey = key.toLowerCase()
        const isId = lowerKey.includes('id') || lowerKey.startsWith('_')
        const isNumber = typeof value === 'number'
        const isCode = lowerKey.includes('code') || lowerKey.includes('ruc') || lowerKey.includes('uom')
        const isEnum = typeof value === 'string' && /^[A-Z0-9_]+$/.test(value) && value.length < 30

        const column: GridColDef<T> = {
            field: key,
            headerName: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        }

        if (isNumber) {
            column.type = 'number'
            column.width = 120
        } else if (isId || isCode) {
            column.width = 140
        } else {
            column.flex = 1
            column.minWidth = 120
            column.maxWidth = 300
        }

        if (isEnum) {
            column.renderCell = (params) =>
                params.value?.toString().toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
        }

        return column
    })

    if (options?.handleEditClick && options?.includeActions) {
        cols.push({
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon color="info" />}
                    label="Editar"
                    onClick={() => options.handleEditClick(params.row)}
                    showInMenu
                />,
            ],
        } as GridColDef<T>)
    }

    return cols
}

export const _columns = generateColumnsFromEntity(new WarehouseStockENTITYFlat(), {
	handleEditClick: (row) => console.log('Edit:', row),
	includeActions: true,
})
