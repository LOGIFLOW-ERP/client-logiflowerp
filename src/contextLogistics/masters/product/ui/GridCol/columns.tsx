import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { getDataProducType, getDataState, State, ProductENTITY, ProducType } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'
import { Avatar } from '@mui/material'
import { ReactElement } from 'react'
import { GridActionsCellItemProps } from '@mui/x-data-grid'

interface IParams {
    handleChangeStatusClick: (row: ProductENTITY) => void
    handleEditClick: (row: ProductENTITY) => void
    PUT_PRODUCT_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<ProductENTITY>[] => {
    const { handleChangeStatusClick, handleEditClick, PUT_PRODUCT_BY_ID } = params
    return [
        {
            field: 'itemCode',
            headerName: 'Código',
            width: 90,
        },
        {
            field: 'itemName',
            headerName: 'Nombre',
            width: 180,
        },
        {
            field: 'uomCode',
            headerName: 'UM',
            width: 180,
        },
        {
            field: 'minLevel',
            headerName: 'Min',
            width: 180,
        },
        {
            field: 'maxLevel',
            headerName: 'Max',
            width: 100,
        },
        {
            field: 'producType',
            headerName: 'Tipo Prod',
            valueOptions: getDataProducType(),
            width: 100,
            renderCell: ({ value }) => {
                const mapColor: Record<ProducType, string> = {
                    'S': '#007BFF',
                    'B': '#FFC107',
                    'G': '#28A745',
                }
                return (
                    <Avatar style={{ backgroundColor: mapColor[value as ProducType] }}>
                        {value}
                    </Avatar>
                )
            }
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatus,
            type: 'singleSelect',
            valueOptions: getDataState(),
            width: 100,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 50,
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                if (PUT_PRODUCT_BY_ID) {
                    actions.push(
                        <GridActionsCellItem
                            key='changeStatus'
                            icon={<ChangeCircleIcon />}
                            label={params.row.state === State.ACTIVO ? 'Desactivar' : 'Activar'}
                            onClick={() => handleChangeStatusClick(params.row)}
                            showInMenu
                        />
                    )
                    actions.push(
                        <GridActionsCellItem
                            key='edit'
                            icon={<EditIcon />}
                            label='Editar'
                            onClick={() => handleEditClick(params.row)}
                            showInMenu
                        />
                    )
                }
                return actions
            },
        },
    ]
}
