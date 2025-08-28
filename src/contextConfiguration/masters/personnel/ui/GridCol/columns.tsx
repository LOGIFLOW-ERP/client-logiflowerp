import {
    GridActionsCellItem,
    GridColDef
} from '@mui/x-data-grid'
import { getDataState, EmployeeENTITY, State, ProfileENTITY } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'
import { ReactElement } from 'react'
import { GridActionsCellItemProps } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

interface IParams {
    handleChangeStatusClick: (row: EmployeeENTITY) => void
    handleEditClick: (row: EmployeeENTITY) => void
    handleDeleteClick: (row: EmployeeENTITY) => Promise<void>
    dataProfiles: ProfileENTITY[] | undefined
    DELETE_PERSONNEL_BY_ID: boolean
    PUT_PERSONNEL_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<EmployeeENTITY>[] => {
    const {
        handleChangeStatusClick,
        handleEditClick,
        handleDeleteClick,
        dataProfiles = [],
        DELETE_PERSONNEL_BY_ID,
        PUT_PERSONNEL_BY_ID
    } = params
    return [
        {
            field: 'identity',
            headerName: 'Identificación',
            width: 110,
        },
        {
            field: 'documentType',
            headerName: 'Tipo documento',
            width: 130,
        },
        {
            field: 'names',
            headerName: 'Nombres',
            width: 200,
        },
        {
            field: 'surnames',
            headerName: 'Apellidos',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
        },
        {
            field: '_idprofile',
            headerName: 'Perfil',
            width: 150,
            valueGetter: (value: string) => {
                const profile = dataProfiles.find(e => e._id === value)
                if (profile) {
                    return profile.name
                }
                return ''
            }
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatus,
            type: 'singleSelect',
            valueOptions: getDataState(),
            width: 100,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                if (PUT_PERSONNEL_BY_ID) {
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
                if (DELETE_PERSONNEL_BY_ID) {
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
