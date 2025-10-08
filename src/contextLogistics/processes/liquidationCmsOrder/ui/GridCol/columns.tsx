import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { TOAOrderENTITY } from 'logiflowerp-sdk'
import InventoryIcon from '@mui/icons-material/Inventory';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import { ReactElement } from 'react'

interface IParams {
    // handleChangeStatusClick: (row: StoreENTITY) => void
    handleLiquidationClick: (row: TOAOrderENTITY) => void
    handleInventoryClick: (row: TOAOrderENTITY) => void
    // handleDeleteClick: (row: StoreENTITY) => Promise<void>
    // PUT_STORE_BY_ID: boolean
    // DELETE_STORE_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<TOAOrderENTITY>[] => {
    const { handleLiquidationClick, handleInventoryClick } = params
    return [
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                // if (DELETE_STORE_BY_ID) {
                if (true) {
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
            field: 'numero_ot',
            headerName: 'Número OT',
        },
        {
            field: 'numero_de_peticion',
            headerName: 'Número de Petición',
        },
    ]
}
