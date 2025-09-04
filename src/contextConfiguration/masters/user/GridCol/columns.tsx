import {
    GridActionsCellItem,
    GridColDef
} from '@mui/x-data-grid'
import { getDataState, State, UserENTITY } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import { ReactElement } from 'react'
import { GridActionsCellItemProps } from '@mui/x-data-grid'

interface IParams {
    handleChangeStatusClick: (row: UserENTITY) => void
    PUT_USER_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<UserENTITY>[] => {
    const {
        handleChangeStatusClick,
        PUT_USER_BY_ID,
    } = params
    return [
        {
            field: 'identity',
            headerName: 'Identificación',
        },
        {
            field: 'documentType',
            headerName: 'Tipo documento',
        },
        {
            field: 'names',
            headerName: 'Nombres',
        },
        {
            field: 'surnames',
            headerName: 'Apellidos',
        },
        {
            field: 'email',
            headerName: 'Email',
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatus,
            type: 'singleSelect',
            valueOptions: getDataState(),
            editable: true,
        },
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                if (PUT_USER_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key='changeStatus'
                            icon={<ChangeCircleIcon color={params.row.state === State.ACTIVO ? 'error' : 'success'} />}
                            label={params.row.state === State.ACTIVO ? 'Desactivar' : 'Activar'}
                            onClick={() => handleChangeStatusClick(params.row)}
                            showInMenu
                        />
                    )
                }
                return actions
            },
        },
    ]
}
