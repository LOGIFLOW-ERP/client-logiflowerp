import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { CompanyDTO, getDataState, State, StoreENTITY } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { ReactElement } from 'react'

interface IParams {
    handleChangeStatusClick: (row: StoreENTITY) => void
    handleEditClick: (row: StoreENTITY) => void
    handleDeleteClick: (row: StoreENTITY) => Promise<void>
    PUT_STORE_BY_ID: boolean
    DELETE_STORE_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<StoreENTITY>[] => {
    const { handleChangeStatusClick, handleEditClick, handleDeleteClick, DELETE_STORE_BY_ID, PUT_STORE_BY_ID } = params
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
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                if (PUT_STORE_BY_ID) {
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
                if (DELETE_STORE_BY_ID) {
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
