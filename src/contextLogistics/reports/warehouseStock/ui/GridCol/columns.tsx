import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { IWarehouseStockENTITY } from 'logiflowerp-sdk'
import EditIcon from '@mui/icons-material/Edit'

interface IParams {
    // handleDeleteClick: (row: IWarehouseStockENTITY) => void
    handleEditClick: (row: IWarehouseStockENTITY) => void
    // canDeleteWarehouseExitByID: boolean
}

export const columns = (params: IParams): GridColDef<IWarehouseStockENTITY>[] => {
    const { handleEditClick } = params
    return [
        {
            field: 'stockType',
            headerName: 'Tipo Stock',
            width: 125,
        },
        {
            field: 'store_company_companyname',
            headerName: 'Empresa',
            width: 105
        },
        {
            field: 'store_code',
            headerName: 'Codigo Almacén',
            width: 100,
        },
        {
            field: 'store_name',
            headerName: 'Nombre Almacén',
            width: 200,
        },
        {
            field: 'state',
            headerName: 'state',
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
            ],
        },
    ]
}
