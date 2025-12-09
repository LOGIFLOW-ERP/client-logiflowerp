import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { getDataState, StateOrder, WarehouseEntryENTITY } from 'logiflowerp-sdk'
import { CustomStatusOrder } from '@shared/ui-library'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit'
import { ReactElement } from 'react'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

interface IParams {
    handleDeleteClick: (row: WarehouseEntryENTITY) => void
    handleEditClick: (row: WarehouseEntryENTITY) => void
    canDeleteWarehouseEntryByID: boolean,
    handleViewPdfClick: (row: WarehouseEntryENTITY) => void
}

export const columns = (params: IParams): GridColDef<WarehouseEntryENTITY>[] => {
    const {
        handleEditClick,
        handleDeleteClick,
        canDeleteWarehouseEntryByID,
        handleViewPdfClick
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
                    if (canDeleteWarehouseEntryByID) {
                        actions.push(
                            <GridActionsCellItem
                                icon={<DeleteForeverRoundedIcon color='error' />}
                                label='Eliminar'
                                onClick={() => handleDeleteClick(params.row)}
                                showInMenu
                            />
                        )
                    }
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
            headerName: 'Fecha, Registro',
            type: 'dateTime',
            valueGetter: (_value, row) => new Date(row.workflow.register.date)
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatusOrder,
            valueOptions: getDataState(),
        }
    ]
}
