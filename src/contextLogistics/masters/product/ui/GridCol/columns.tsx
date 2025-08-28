import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { getDataProducType, getDataState, State, ProductENTITY, ProducType } from 'logiflowerp-sdk'
import { CustomStatus } from '@shared/ui-library'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EditIcon from '@mui/icons-material/Edit'
import { Chip } from '@mui/material'
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
        },
        {
            field: 'itemName',
            headerName: 'Nombre',
            maxWidth: 500,
        },
        {
            field: 'uomCode',
            headerName: 'UM',
        },
        {
            field: 'minLevel',
            headerName: 'Min',
        },
        {
            field: 'maxLevel',
            headerName: 'Max',
        },
        {
            field: 'producType',
            headerName: 'Tipo Prod',
            valueOptions: getDataProducType(),
            align: 'center',
            renderCell: ({ value }) => {
                const mapColor: Record<ProducType, 'success' | 'warning' | 'primary'> = {
                    'S': 'primary',
                    'B': 'warning',
                    'G': 'success',
                }
                return (
                    <Chip
                        label={value}
                        color={mapColor[value as ProducType]}
                        size='small'
                    />
                )
            },
            display: 'flex' as const,
        },
        {
            field: 'state',
            headerName: 'Status',
            renderCell: CustomStatus,
            type: 'singleSelect',
            valueOptions: getDataState(),
            display: 'flex' as const,
        },
        {
            field: 'actions',
            type: 'actions',
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
