import {
    GridActionsCellItem,
    GridActionsCellItemProps,
    GridColDef,
} from '@mui/x-data-grid'
import { ProductGroupENTITY } from 'logiflowerp-sdk'
import { ReactElement } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

interface IParams {
    handleEditClick: (row: ProductGroupENTITY) => void
    handleDeleteClick: (row: ProductGroupENTITY) => Promise<void>
    PUT_PRODUCT_GROUP_BY_ID: boolean
    DELETE_PRODUCT_GROUP_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<ProductGroupENTITY>[] => {
    const {
        handleDeleteClick,
        handleEditClick,
        PUT_PRODUCT_GROUP_BY_ID,
        DELETE_PRODUCT_GROUP_BY_ID,
    } = params
    return [
        {
            field: 'itmsGrpCod',
            headerName: 'Código',
            editable: true
        },
        {
            field: 'itmsGrpNam',
            headerName: 'Nombre',
            editable: true
        },
        {
            field: 'Acciones',
            type: 'actions',
            width: 50,
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                if (PUT_PRODUCT_GROUP_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key='edit'
                            icon={<EditIcon color='primary' />}
                            label='Editar'
                            onClick={() => handleEditClick(params.row)}
                            showInMenu
                        />
                    )
                }
                if (DELETE_PRODUCT_GROUP_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key="delete"
                            icon={<DeleteIcon color='error' />}
                            label='Eliminar'
                            onClick={() => handleDeleteClick(params.row)}
                            showInMenu
                        />
                    )
                }
                return actions
            },
        }
    ]
}