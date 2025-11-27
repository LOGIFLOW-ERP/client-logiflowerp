import { GridColDef } from '@mui/x-data-grid'
import {
    DataSerialTracking,
    EmployeeDTO,
    MovementOrderDTO,
    ProductOrderDTO,
    StoreDTO
} from 'logiflowerp-sdk'

export const columnsOrder = (): GridColDef<DataSerialTracking>[] => {
    return [
        {
            field: 'documentNumber',
            headerName: 'N° Doc.',
        },
        {
            field: 'stateDocument',
            headerName: 'Est. Doc.',
        },
        {
            field: 'movement',
            headerName: 'Movimiento',
            valueGetter: (value: MovementOrderDTO) => value.name,
        },
        {
            field: 'store',
            headerName: 'Almacén',
            valueGetter: (value: StoreDTO) => value.code,
        },
        {
            field: 'item',
            headerName: 'Producto',
            valueGetter: (value: ProductOrderDTO) => `${value.itemCode} - ${value.itemName}`,
        },
        {
            field: 'serial',
            headerName: 'Serie',
        },
        {
            field: 'stateSerial',
            headerName: 'Est. Serie',
        },
        {
            field: 'employee',
            headerName: 'Personal',
            valueGetter: (value: EmployeeDTO) => `${value.identity} - ${value.names} ${value.surnames}`,
        },
        {
            field: 'updatedate',
            headerName: 'Fecha Actualización',
            valueGetter: (value: string) => new Date(value),
            type: 'dateTime'
        },
    ]
}
