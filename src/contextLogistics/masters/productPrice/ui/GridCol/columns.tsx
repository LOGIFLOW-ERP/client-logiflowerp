import {
    GridActionsCellItem,
    GridActionsCellItemProps,
    GridColDef,
} from '@mui/x-data-grid'
import { CurrencyDTO, ProductENTITY, ProductPriceENTITY } from 'logiflowerp-sdk'
import { ReactElement } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

interface IParams {
    handleEditClick: (row: ProductPriceENTITY) => void
    handleDeleteClick: (row: ProductPriceENTITY) => Promise<void>
    dataProducts?: ProductENTITY[]
    PUT_PRODUCT_PRICE_BY_ID: boolean
    DELETE_PRODUCT_PRICE_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<ProductPriceENTITY>[] => {
    const {
        handleDeleteClick,
        handleEditClick,
        dataProducts = [],
        PUT_PRODUCT_PRICE_BY_ID,
        DELETE_PRODUCT_PRICE_BY_ID,
    } = params
    return [
        {
            field: 'itemCode',
            headerName: 'Código',
        },
        {
            field: 'itemName',
            headerName: 'Nombre',
            valueGetter: (_value, row) => {
                const product = dataProducts.find(e => e.itemCode === row.itemCode)
                return product ? product.itemName : '-'
            }
        },
        {
            field: 'price',
            headerName: 'Precio',
            type: 'number',
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'currency',
            headerName: 'Divisa',
            valueGetter: (value: CurrencyDTO) => value.code
        },
        {
            field: 'Actions',
            type: 'actions',
            width: 50,
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                if (PUT_PRODUCT_PRICE_BY_ID) {
                    // actions.push(
                    //     <GridActionsCellItem
                    //         key='changeStatus'
                    //         icon={<ChangeCircleIcon />}
                    //         label={params.row.state === State.ACTIVO ? 'Desactivar' : 'Activar'}
                    //         onClick={() => handleChangeStatusClick(params.row)}
                    //         showInMenu
                    //     />
                    // )
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
                if (DELETE_PRODUCT_PRICE_BY_ID) {
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