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
        },
        {
            field: 'ruc',
            headerName: 'RUC',
        },
        {
            field: 'companyname',
            headerName: 'Nombre',
        },
        {
            field: 'suppliertype',
            headerName: 'Tipo',
        },
        {
            field: 'email',
            headerName: 'Correo electrónico',
        },
        {
            field: 'address',
            headerName: 'Dirección',
        },
        {
            field: 'phone',
            headerName: 'Teléfono',
        },
        {
            field: 'website',
            headerName: 'Sitio web',
        },
        {
            field: 'sector',
            headerName: 'Sector',
        },
        {
            field: 'identityManager',
            headerName: 'ID Gerente',
        },
        {
            field: 'creation_date',
            headerName: 'Fecha de creación',
            type: 'date',
            valueGetter: (value: string) => new Date(value)
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatus,
            type: 'singleSelect',
            valueOptions: getDataState(),
        },
        {
            field: 'Acciones',
            type: 'actions',
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
