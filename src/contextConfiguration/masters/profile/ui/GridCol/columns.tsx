import {
    GridActionsCellItem,
    GridActionsCellItemProps,
    GridColDef
} from '@mui/x-data-grid'
import { getDataState, ProfileENTITY, State } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { ReactElement } from 'react'

interface IParams {
    handleChangeStatusClick: (row: ProfileENTITY) => void
    handleEditClick: (row: ProfileENTITY) => void
    handleDeleteClick: (row: ProfileENTITY) => Promise<void>
    PUT_PROFILE_BY_ID: boolean
    DELETE_PROFILE_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<ProfileENTITY>[] => {
    const { handleChangeStatusClick, handleEditClick, handleDeleteClick, PUT_PROFILE_BY_ID, DELETE_PROFILE_BY_ID } = params
    return [
        {
            field: 'name',
            headerName: 'Nombre',
            width: 110,
        },
        {
            field: 'description',
            headerName: 'Descripción',
            width: 220,
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
                if (PUT_PROFILE_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key="toggle"
                            icon={<ChangeCircleIcon />}
                            label={params.row.state === State.ACTIVO ? 'Desactivar' : 'Activar'}
                            onClick={() => handleChangeStatusClick(params.row)}
                            showInMenu
                        />
                    )
                    actions.push(
                        <GridActionsCellItem
                            key="edit"
                            icon={<EditIcon />}
                            label="Editar"
                            onClick={() => handleEditClick(params.row)}
                            showInMenu
                        />
                    )
                }
                if (DELETE_PROFILE_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key="delete"
                            icon={<DeleteIcon />}
                            label="Eliminar"
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
