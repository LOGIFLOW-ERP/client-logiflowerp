import EditIcon from '@mui/icons-material/Edit'
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
import { WarehouseStockENTITYFlat } from 'logiflowerp-sdk'

interface IParams {
    handleEditClick: (row: WarehouseStockENTITYFlat) => void
}

export function generateColumnsFromEntity__<T extends WarehouseStockENTITYFlat>(
    exampleEntity: T,
    params: IParams
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
    const { handleEditClick } = params
    if (handleEditClick) {
        cols.push({
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon color="info" />}
                    label="Editar"
                    onClick={() => handleEditClick(params.row)}
                    showInMenu
                />,
            ],
        } as GridColDef<T>)
    }

    return cols
}

// export function getcolumns(params: IParams): GridColDef<WarehouseStockENTITYFlat>[] {
//     return generateColumnsFromEntity(new WarehouseStockENTITYFlat(), params)

// }
export function getcolumns(params: IParams): GridColDef<WarehouseStockENTITYFlat>[] {
    const columnsBase = generateColumnsFromEntity(new WarehouseStockENTITYFlat());
    const { handleEditClick } = params;
    const finalColumns = [
        ...columnsBase,
        {
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params: { row: WarehouseStockENTITYFlat }) => [
                <GridActionsCellItem
                    icon={<EditIcon color="info" />}
                    label="Editar"
                    onClick={() => handleEditClick(params.row)}
                    showInMenu
                />,
            ],
        } as GridColDef<WarehouseStockENTITYFlat>,
    ];
    return finalColumns;
}

export const generateColumnsFromEntity = (entityInstance: WarehouseStockENTITYFlat): GridColDef[] => {
    const flatObject = flattenObject(entityInstance);

    return Object.entries(flatObject).map(([key, value]) => ({
        field: key,
        headerName: toTitleCase(key),
        width: 150,
        type: inferType(value),
    }));
};

// Utilidad para aplanar objetos anidados
const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    return Object.entries(obj).reduce((acc, [k, v]) => {
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'object' && v !== null && !(v instanceof Date)) {
            Object.assign(acc, flattenObject(v, fullKey));
        } else {
            acc[fullKey] = v;
        }
        return acc;
    }, {} as Record<string, any>);
};

const toTitleCase = (str: string) =>
    str
        .replace(/\./g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

const inferType = (value: any): GridColDef['type'] => {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (value instanceof Date) return 'dateTime';
    return 'string';
};

