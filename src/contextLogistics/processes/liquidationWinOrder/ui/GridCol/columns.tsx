import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { WINOrderENTITY } from 'logiflowerp-sdk'
import InventoryIcon from '@mui/icons-material/Inventory';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import { ReactElement } from 'react'

interface IParams {
    handleLiquidationClick: (row: WINOrderENTITY) => void
    handleInventoryClick: (row: WINOrderENTITY) => void
    PUT_LIQUIDATION_WIN_ORDER_ADD_INVENTORY_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<WINOrderENTITY>[] => {
    const {
        handleLiquidationClick,
        handleInventoryClick,
        PUT_LIQUIDATION_WIN_ORDER_ADD_INVENTORY_BY_ID
    } = params
    return [
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                // if (DELETE_STORE_BY_ID) {
                if (PUT_LIQUIDATION_WIN_ORDER_ADD_INVENTORY_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key='liquidation'
                            icon={<InventoryIcon color='primary' />}
                            label='Liquidar'
                            onClick={() => handleLiquidationClick(params.row)}
                            showInMenu
                        />
                    )
                }
                actions.push(
                    <GridActionsCellItem
                        key='inventory'
                        icon={<ViewHeadlineIcon color='primary' />}
                        label='Inventario'
                        onClick={() => handleInventoryClick(params.row)}
                        showInMenu
                    />
                )
                return actions
            },
        },
        {
            field: 'subtipo_de_actividad',
            headerName: 'Actividad',
        },
        {
            field: 'numero_de_peticion',
            headerName: 'Número de Petición',
        },
    ]
}
