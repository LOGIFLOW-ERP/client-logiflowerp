import {
    GridActionsCellItem,
    GridColDef
} from '@mui/x-data-grid'
import { getDataState, ProfileENTITY, State } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'

interface IParams {
    handleChangeStatusClick: (row: ProfileENTITY) => void
    handleEditClick: (row: ProfileENTITY) => void
}

export const columns = (params: IParams): GridColDef<ProfileENTITY>[] => {
    const { handleChangeStatusClick, handleEditClick } = params
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
