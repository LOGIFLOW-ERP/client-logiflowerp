import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { getDataState, StateOrder, WarehouseExitENTITY } from 'logiflowerp-sdk'
import { CustomStatusOrder } from '@shared/ui-library'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit'
import { ReactElement } from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface IParams {
    handleDeleteClick: (row: WarehouseExitENTITY) => void
    handleEditClick: (row: WarehouseExitENTITY) => void
    handleViewPdfClick: (row: WarehouseExitENTITY) => void
    canDeleteWarehouseExitByID: boolean
}

export const columns = (params: IParams): GridColDef<WarehouseExitENTITY>[] => {
    const {
        handleEditClick,
        handleDeleteClick,
        handleViewPdfClick,
        canDeleteWarehouseExitByID
    } = params
    return [
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                if (params.row.state !== StateOrder.VALIDADO) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<EditIcon color='info' />}
                            label='Editar'
                            onClick={() => handleEditClick(params.row)}
                            showInMenu
                        />
                    )
                }
                if (params.row.state === StateOrder.VALIDADO) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<PictureAsPdfIcon color='info' />}
                            label='Ver guía PDF'
                            onClick={() => handleViewPdfClick(params.row)}
                            showInMenu
                        />
                    )
                }
                if (canDeleteWarehouseExitByID && params.row.state !== StateOrder.VALIDADO) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<DeleteForeverRoundedIcon color='error' />}
                            label='Eliminar'
                            onClick={() => handleDeleteClick(params.row)}
                            showInMenu
                        />
                    )
                }
                return actions
            }
        },
        {
            field: 'documentNumber',
            headerName: 'Nro. Documento',
        },
        {
            field: 'storeCode',
            headerName: 'Cd. Almacén',
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
            valueGetter: (_value, row) => new Date(row.workflow.register.date),
            valueFormatter: (params: Date) => {
                return params.toLocaleString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })
            }
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatusOrder,
            valueOptions: getDataState(),
        }
    ]
}
