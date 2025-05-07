import {
    GridActionsCellItem,
    GridColDef
} from '@mui/x-data-grid'
import { getDataState, RootCompanyENTITY, State } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'

interface IParams {
    handleChangeStatusClick: (row: RootCompanyENTITY) => void
    handleEditClick: (row: RootCompanyENTITY) => void
}

export const columns = (params: IParams): GridColDef<RootCompanyENTITY>[] => {
    const { handleChangeStatusClick, handleEditClick } = params
    return [
        {
            field: 'code',
            headerName: 'Código',
            width: 90,
        },
        {
            field: 'ruc',
            headerName: 'RUC',
            width: 110,
        },
        {
            field: 'companyname',
            headerName: 'Nombre',
            width: 220,
        },
        {
            field: 'suppliertype',
            headerName: 'Tipo',
            width: 80,
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
            width: 100,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<ChangeCircleIcon />}
                    label={params.row.state === State.ACTIVO ? 'Desactivar' : 'Activar'}
                    onClick={() => handleChangeStatusClick(params.row)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label='Editar'
                    onClick={() => handleEditClick(params.row)}
                    showInMenu
                />
            ],
        },
    ]
}
