import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { getDataState, WarehouseReturnENTITY } from 'logiflowerp-sdk'
import { CustomStatusOrder } from '@shared/ui-library'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit'

interface IParams {
    handleDeleteClick: (row: WarehouseReturnENTITY) => void
    handleEditClick: (row: WarehouseReturnENTITY) => void
    canDeleteWarehouseReturnByID: boolean
}

export const columns = (params: IParams): GridColDef<WarehouseReturnENTITY>[] => {
    const { handleEditClick, handleDeleteClick, canDeleteWarehouseReturnByID } = params
    return [
        {
            field: 'documentNumber',
            headerName: 'Nro. Documento',
        },
        {
            field: 'storeCode',
            headerName: 'Cód Almacén',
            valueGetter: (_value, row) => {
                return row.store.code
            }
        },
        {
            field: 'storeName',
            headerName: 'Nombre Almacén',
            valueGetter: (_value, row) => {
                return row.store.name
            }
        },
        {
            field: 'companyCode',
            headerName: 'Cód Empresa',
            valueGetter: (_value, row) => {
                return row.store.company.code
            }
        },
        {
            field: 'companyName',
            headerName: 'Nombre Empresa',
            valueGetter: (_value, row) => {
                return row.store.company.companyname
            }
        },
        {
            field: 'creation_date',
            headerName: 'Fecha Registro',
            type: 'dateTime',
            valueGetter: (_value, row) => new Date(row.workflow.register.date)
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatusOrder,
            type: 'singleSelect',
            valueOptions: getDataState(),
        },
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon color='info' />}
                    label='Editar'
                    onClick={() => handleEditClick(params.row)}
                    showInMenu
                />,
                canDeleteWarehouseReturnByID
                    ? <GridActionsCellItem
                        icon={<DeleteForeverRoundedIcon color='error' />}
                        label='Eliminar'
                        onClick={() => handleDeleteClick(params.row)}
                        showInMenu
                    />
                    : <></>,
            ],
        },
    ]
}
