import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { getDataState, StateOrder, WarehouseReturnENTITY } from 'logiflowerp-sdk'
import { CustomStatusOrder } from '@shared/ui-library'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit'
import { ReactElement } from 'react';
import { usePermissions } from '@shared/ui/hooks';
import { PERMISSIONS } from '@shared/application';
import PendingIcon from '@mui/icons-material/Pending'

interface IParams {
    handleDeleteClick: (row: WarehouseReturnENTITY) => void
    handleEditClick: (row: WarehouseReturnENTITY) => void
    handleRegisterClick: (row: WarehouseReturnENTITY) => void
}

export const columns = (params: IParams): GridColDef<WarehouseReturnENTITY>[] => {
    const { handleEditClick, handleDeleteClick, handleRegisterClick } = params

    const [
        POST_WAREHOUSE_RETURN_CREATE_DRAFT_RECORD,
        canDeleteWarehouseReturnByID,
        canRegisterWarehouseReturnByID,
    ] = usePermissions([
        PERMISSIONS.POST_WAREHOUSE_RETURN_CREATE_DRAFT_RECORD,
        PERMISSIONS.DELETE_WAREHOUSE_RETURN_BY_ID,
        PERMISSIONS.PUT_WAREHOUSE_RETURN_REGISTER_BY_ID,
    ])

    return [
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                actions.push(
                    <GridActionsCellItem
                        icon={<EditIcon color='info' />}
                        label='Editar'
                        onClick={() => handleEditClick(params.row)}
                        showInMenu
                    />
                )
                if (canDeleteWarehouseReturnByID) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<DeleteForeverRoundedIcon color='error' />}
                            label='Eliminar'
                            onClick={() => handleDeleteClick(params.row)}
                            showInMenu
                        />
                    )
                }
                if (
                    POST_WAREHOUSE_RETURN_CREATE_DRAFT_RECORD &&
                    params.row.state === StateOrder.BORRADOR &&
                    canRegisterWarehouseReturnByID
                ) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<PendingIcon color='info' />}
                            label='Registrar devolución'
                            onClick={() => handleRegisterClick(params.row)}
                            showInMenu
                        />
                    )
                }
                return actions
            },
        },
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
            field: 'identificación',
            headerName: 'DNI',
            valueGetter: (_value, row) => {
                return row.carrier.identity
            }
        },
        {
            field: 'carrier',
            headerName: 'Personal',
            valueGetter: (_value, row) => {
                return `${row.carrier.names} ${row.carrier.surnames}`
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
            field: 'creation_date',
            headerName: 'Fecha Registro',
            type: 'dateTime',
            valueGetter: (_value, row) => new Date(row.workflow.register.date)
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatusOrder,
            valueOptions: getDataState(),
        },
    ]
}
