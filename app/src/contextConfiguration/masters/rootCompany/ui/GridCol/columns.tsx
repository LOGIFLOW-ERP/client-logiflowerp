import {
    GridColDef,
    GridValidRowModel
} from '@mui/x-data-grid'
import { getDataState } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'

export const columns = <T extends GridValidRowModel,>(): GridColDef<T>[] => {
    return [
        {
            field: 'code',
            headerName: 'Código',
            width: 90,
        },
        {
            field: 'ruc',
            headerName: 'RUC',
            width: 90,
        },
        {
            field: 'companyname',
            headerName: 'Nombre',
            width: 180,
        },
        {
            field: 'suppliertype',
            headerName: 'Tipo',
            width: 100,
        },
        {
            field: 'email',
            headerName: 'Correo electrónico',
            width: 100,
        },
        {
            field: 'address',
            headerName: 'Dirección',
            width: 100,
        },
        {
            field: 'phone',
            headerName: 'Teléfono',
            width: 100,
        },
        {
            field: 'website',
            headerName: 'Sitio web',
            width: 100,
        },
        {
            field: 'sector',
            headerName: 'Sector',
            width: 100,
        },
        {
            field: 'identityManager',
            headerName: 'ID Gerente',
            width: 100,
        },
        {
            field: 'creation_date',
            headerName: 'Fecha de creación',
            width: 100,
            type: 'date',
            valueGetter: (value: string) => new Date(value)
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatus,
            type: 'singleSelect',
            valueOptions: getDataState(),
            width: 150,
            editable: true,
        },
    ]
}
