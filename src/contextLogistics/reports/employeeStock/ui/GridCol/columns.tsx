import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import VisibilityIcon from '@mui/icons-material/Visibility'
import { GridColDef, GridActionsCellItem, GridValidRowModel, GridRowParams } from '@mui/x-data-grid'


interface GetColumnsParams<T> {
    actions?: {
        onEdit?: (row: T) => void
        onDelete?: (row: T) => void
        onView?: (row: T) => void
    }
    entityInstance: T
    excludeFields?: string[]
    renameHeaders?: Record<string, string>
}

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

export function generateColumnsFromEntity<T extends GridValidRowModel>(entityInstance: T): GridColDef<T>[] {
    const flatObject = flattenObject(entityInstance)

    return Object.entries(flatObject).map(([key, value]) => ({
        field: key,
        headerName: toTitleCase(key),
        width: 150,
        type: inferType(value),
    })) as GridColDef<T>[]
}

export function getColumns<T extends GridValidRowModel>({
    actions,
    entityInstance,
    excludeFields = [],
    renameHeaders = {}
}: GetColumnsParams<T>): GridColDef<T>[] {

    // const columnsBase = generateColumnsFromEntity(entityInstance)

    const flatObject = flattenObject(entityInstance);

    const columnsBase: GridColDef<T>[] = Object.entries(flatObject)
        .filter(([key]) => !excludeFields.includes(key))
        .map(([key, value]) => ({
            field: key,
            headerName: renameHeaders[key] ?? toTitleCase(key),
            width: 150,
            type: inferType(value),
        }));

    const actionDescriptors = [
        { handler: actions?.onEdit, label: 'Editar', icon: <EditIcon color="info" /> },
        { handler: actions?.onDelete, label: 'Eliminar', icon: <DeleteForeverRoundedIcon color="error" /> },
        { handler: actions?.onView, label: 'Ver', icon: <VisibilityIcon color="primary" /> }
    ]

    const actionItems = actionDescriptors
        .filter(desc => desc.handler)
        .map(desc => (row: T) =>
            <GridActionsCellItem
                icon={desc.icon}
                label={desc.label}
                onClick={() => desc.handler!(row)}
                showInMenu
            />
        )

    const finalColumns: GridColDef<T>[] = [
        ...columnsBase,
        ...(actionItems.length > 0 ? [{
            field: 'actions',
            type: 'actions' as const,
            width: 80,
            getActions: (params: GridRowParams<T>) =>
                actionItems.map(fn => fn(params.row))
        }] : [])
    ]

    return finalColumns
}

