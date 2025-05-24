import {
    GridActionsCellItem,
    GridActionsCellItemProps,
    GridColDef
} from '@mui/x-data-grid'
import { getDataState, CompanyENTITY, State } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'
import { ReactElement } from 'react'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

interface IParams {
    handleChangeStatusClick: (row: CompanyENTITY) => void
    handleEditClick: (row: CompanyENTITY) => void
    handleDeleteClick: (row: CompanyENTITY) => Promise<void>
    PUT_COMPANY_BY_ID: boolean
    DELETE_COMPANY_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<CompanyENTITY>[] => {
    const { handleChangeStatusClick, handleEditClick, handleDeleteClick, DELETE_COMPANY_BY_ID, PUT_COMPANY_BY_ID } = params
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
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                if (PUT_COMPANY_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key='changeStatus'
                            icon={<ChangeCircleIcon />}
                            label={params.row.state === State.ACTIVO ? 'Desactivar' : 'Activar'}
                            onClick={() => handleChangeStatusClick(params.row)}
                            showInMenu
                        />
                    )
                    actions.push(
                        <GridActionsCellItem
                            key='edit'
                            icon={<EditIcon />}
                            label='Editar'
                            onClick={() => handleEditClick(params.row)}
                            showInMenu
                        />
                    )
                }
                if (DELETE_COMPANY_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key="delete"
                            icon={<DeleteIcon />}
                            label='Eliminar'
                            onClick={() => handleDeleteClick(params.row)}
                            showInMenu
                        />
                    )
                }
                return actions
            },
        },
    ]
}
