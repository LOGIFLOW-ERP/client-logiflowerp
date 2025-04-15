import { GridColDef } from '@mui/x-data-grid'
import { CompanyDTO, getDataState, StoreENTITY } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'

export const columns = (): GridColDef<StoreENTITY>[] => {
    return [
        {
            field: 'company',
            headerName: 'Empresa',
            width: 180,
            valueGetter: (value: CompanyDTO) => {
                return `${value.code} ${value.companyname}`
            }
        },
        {
            field: 'code',
            headerName: 'Código',
            width: 90,
        },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 180,
        },
        {
            field: 'address',
            headerName: 'Dirección',
            width: 180,
        },
        {
            field: 'storagecapacity',
            headerName: 'Capacidad',
            width: 180,
        },
        {
            field: 'storetype',
            headerName: 'Tipo',
            width: 100,
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
