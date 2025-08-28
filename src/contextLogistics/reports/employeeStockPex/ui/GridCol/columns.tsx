import EditIcon from '@mui/icons-material/Edit';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { EmployeeStockPEXENTITYFlat } from 'logiflowerp-sdk';

interface IParams {
    handleEditClick: (row: EmployeeStockPEXENTITYFlat) => void;
    rows: EmployeeStockPEXENTITYFlat[];
    fieldsToInclude?: string[];
    renameMap?: Record<string, string>;
    minWidth?: number;
    maxWidth?: number;
    extraColumns?: GridColDef[];   // 👈 aquí agregamos columnas extra por parámetro
}

export function getcolumns(params: IParams): GridColDef<EmployeeStockPEXENTITYFlat>[] {
    const {
        handleEditClick,
        rows,
        fieldsToInclude,
        renameMap,
        minWidth,
        maxWidth,
        extraColumns = []          // 👈 valor por defecto vacío
    } = params;

    const columnsBase = generateColumnsFromEntity(
        new EmployeeStockPEXENTITYFlat(),
        rows,
        fieldsToInclude,
        renameMap,
        minWidth,
        maxWidth
    );

    const finalColumns: GridColDef<EmployeeStockPEXENTITYFlat>[] = [
        ...columnsBase,
        ...extraColumns,
        {
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params: { row: EmployeeStockPEXENTITYFlat }) => [
                <GridActionsCellItem
                    icon={<EditIcon color="info" />}
                    label="Editar"
                    onClick={() => handleEditClick(params.row)}
                    showInMenu
                />,
            ],
        },
    ];

    return finalColumns;
}

export const generateColumnsFromEntity = (
    entityInstance: EmployeeStockPEXENTITYFlat,
    rows: Record<string, any>[],
    fieldsToInclude?: string[],
    renameMap: Record<string, string> = {},
    minWidth: number = 80,
    maxWidth: number = 300
): GridColDef[] => {
    const flatObject = flattenObject(entityInstance);

    return Object.entries(flatObject)
        .filter(([key]) => {
            if (!fieldsToInclude || fieldsToInclude.length === 0) return true;
            return fieldsToInclude.includes(key);
        })
        .map(([key, value]) => {
            const header = renameMap[key] ?? toTitleCase(key);

            // Calcular longitudes: header + valores en filas
            const headerLength = header.length;
            const maxRowLength = Math.max(
                ...rows.map((row) =>
                    row[key] !== null && row[key] !== undefined ? row[key].toString().length : 0
                ),
                0
            );

            // Calcular ancho con factor px por caracter
            let width = Math.max(headerLength, maxRowLength) * 8 + 40;

            // Clamp entre min y max
            width = Math.min(Math.max(width, minWidth), maxWidth);

            return {
                field: key,
                headerName: header,
                width,
                type: inferType(value),
            };
        });
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
