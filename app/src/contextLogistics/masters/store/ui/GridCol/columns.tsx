import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { CompanyDTO, getDataState, State, StoreENTITY } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'

interface IParams {
    handleChangeStatusClick: (row: StoreENTITY) => void
    handleEditClick: (row: StoreENTITY) => void
}

export const columns = (params: IParams): GridColDef<StoreENTITY>[] => {
    const { handleChangeStatusClick, handleEditClick } = params
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
