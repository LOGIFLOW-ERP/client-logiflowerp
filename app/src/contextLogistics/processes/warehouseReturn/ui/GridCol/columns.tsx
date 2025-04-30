import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { getDataState, WarehouseReturnENTITY } from 'logiflowerp-sdk'
import { CustomStatusOrder } from '@shared/ui-library'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit'

interface IParams {
    handleDeleteClick: (row: WarehouseReturnENTITY) => void
    handleEditClick: (row: WarehouseReturnENTITY) => void
}

export const columns = (params: IParams): GridColDef<WarehouseReturnENTITY>[] => {
    const { handleEditClick, handleDeleteClick } = params
    return [
        {
            field: 'documentNumber',
            headerName: 'Nro. Documento',
            width: 125,
        },
        {
            field: 'storeCode',
            headerName: 'Cód Almacén',
            width: 105,
            valueGetter: (_value, row) => {
                return row.store.code
            }
        },
        {
            field: 'storeName',
            headerName: 'Nombre Almacén',
            width: 200,
            valueGetter: (_value, row) => {
                return row.store.name
            }
        },
        {
            field: 'companyCode',
            headerName: 'Cód Empresa',
            width: 105,
            valueGetter: (_value, row) => {
                return row.store.company.code
            }
        },
        {
            field: 'companyName',
            headerName: 'Nombre Empresa',
            width: 300,
            valueGetter: (_value, row) => {
                return row.store.company.companyname
            }
        },
        {
            field: 'creation_date',
            headerName: 'Fecha Registro',
            width: 190,
            type: 'dateTime',
            valueGetter: (_value, row) => new Date(row.workflow.register.date)
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatusOrder,
            type: 'singleSelect',
            valueOptions: getDataState(),
            width: 116,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon color='info' />}
                    label='Editar'
                    onClick={() => handleEditClick(params.row)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteForeverRoundedIcon color='error' />}
                    label='Eliminar'
                    onClick={() => handleDeleteClick(params.row)}
                    showInMenu
                />,
            ],
        },
    ]
}
