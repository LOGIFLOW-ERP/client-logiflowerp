import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { WINOrderENTITY } from 'logiflowerp-sdk'
import InventoryIcon from '@mui/icons-material/Inventory';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import { ReactElement } from 'react'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import TaskIcon from '@mui/icons-material/Task';

interface IParams {
    handleLiquidationClick: (row: WINOrderENTITY) => void
    handleInventoryClick: (row: WINOrderENTITY) => void
    handleSendReviewClick: (row: WINOrderENTITY) => void
    handleFinalizeOrderClick: (row: WINOrderENTITY) => void
    PUT_LIQUIDATION_WIN_ORDER_ADD_INVENTORY_BY_ID: boolean
    PUT_LIQUIDATION_WIN_ORDER_FINALIZE_ORDER_BY_ID: boolean
    PUT_LIQUIDATION_WIN_ORDER_SEND_REVIEW_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<WINOrderENTITY>[] => {
    const {
        handleLiquidationClick,
        handleInventoryClick,
        handleSendReviewClick,
        handleFinalizeOrderClick,
        PUT_LIQUIDATION_WIN_ORDER_ADD_INVENTORY_BY_ID,
        PUT_LIQUIDATION_WIN_ORDER_FINALIZE_ORDER_BY_ID,
        PUT_LIQUIDATION_WIN_ORDER_SEND_REVIEW_BY_ID
    } = params
    return [
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
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
                if (PUT_LIQUIDATION_WIN_ORDER_SEND_REVIEW_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key='send-review'
                            icon={<BookmarkAddedIcon color='warning' />}
                            label='Enviar a Revisión'
                            onClick={() => handleSendReviewClick(params.row)}
                            showInMenu
                        />
                    )
                }
                if (PUT_LIQUIDATION_WIN_ORDER_FINALIZE_ORDER_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key='finalize-order'
                            icon={<TaskIcon color='success' />}
                            label='Finalizar Orden'
                            onClick={() => handleFinalizeOrderClick(params.row)}
                            showInMenu
                        />
                    )
                }
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
