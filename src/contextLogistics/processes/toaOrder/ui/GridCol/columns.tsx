import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { TOAOrderENTITY } from 'logiflowerp-sdk'
import GridViewIcon from '@mui/icons-material/GridView';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import { ReactElement } from 'react'
import { Chip } from '@mui/material';

interface IParams {
    // handleChangeStatusClick: (row: StoreENTITY) => void
    // handleLiquidationClick: (row: TOAOrderENTITY) => void
    handleInventoryClick: (row: TOAOrderENTITY) => void
    handleProductsServicesClick: (row: TOAOrderENTITY) => void
    // handleDeleteClick: (row: StoreENTITY) => Promise<void>
    // PUT_STORE_BY_ID: boolean
    // DELETE_STORE_BY_ID: boolean
}

export const columns = (params: IParams): GridColDef<TOAOrderENTITY>[] => {
    const { handleInventoryClick, handleProductsServicesClick } = params
    return [
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                // if (DELETE_STORE_BY_ID) {
                if (true) {
                    // actions.push(
                    //     <GridActionsCellItem
                    //         key='liquidation'
                    //         icon={<InventoryIcon color='primary' />}
                    //         label='Liquidar'
                    //         onClick={() => handleLiquidationClick(params.row)}
                    //         showInMenu
                    //     />
                    // )
                }
                actions.push(
                    <GridActionsCellItem
                        key='inventory'
                        icon={<ViewHeadlineIcon color='primary' fontSize='small' />}
                        label='Inventario'
                        onClick={() => handleInventoryClick(params.row)}
                        showInMenu

                    />
                )
                actions.push(
                    <GridActionsCellItem
                        key='productos_servicios'
                        icon={<GridViewIcon color='primary' fontSize='small' />}
                        label='Productos servicios'
                        onClick={() => handleProductsServicesClick(params.row)}
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
            field: 'access_id',
            headerName: 'Access ID',
        },
        {
            field: 'numero_de_peticion',
            headerName: 'Número Petición',
        },
        {
            field: 'subtipo_de_actividad',
            headerName: 'Actividad',
        },
        {
            field: 'tipo_de_tecnologia_legados',
            headerName: 'Técnologia',
        },
        {
            field: 'reiterada_tdi',
            headerName: 'Reiterada',
        },
        {
            field: 'segmento',
            valueGetter: (value: any) => value.codigo,
            headerName: 'segmento',
        },
        {
            field: 'ubicacion',
            valueGetter: (value: any) => value.departamento,
            headerName: 'Zona',
        },
        {
            field: 'fecha_de_cita',
            headerName: 'F. Agenda',
            type: 'dateTime',
            valueGetter: (value) => new Date(value),
            renderCell: ({ value }) => {
                return (
                    <span style={{ color: '#e42a71ff', fontWeight: 400 }}>
                        {value.toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}
                    </span>
                )
            },
        },
        {
            field: 'time_slot',
            headerName: 'Franja',
            renderCell: ({ value, row }) => {
                if (!value) return value

                const [startHour, endHour] = value.split('-').map(Number)
                const settlement_date = new Date(row.settlement_date)
                const fecha_de_cita = new Date(row.fecha_de_cita)

                const startTime = new Date(fecha_de_cita)
                startTime.setHours(startHour, 0, 0, 0)

                const endTime = new Date(fecha_de_cita)
                endTime.setHours(endHour, 0, 0, 0)

                let color: 'info' | 'error' | 'success' | 'primary' | 'default' | 'secondary' | 'warning' = 'info'

                if (settlement_date > endTime) {
                    color = 'error';
                } else if (settlement_date >= startTime && settlement_date <= endTime) {
                    color = 'success'
                } else if (settlement_date < startTime) {
                    color = 'primary'
                }

                return (
                    <Chip label={value} color={color} size='small' />
                );
            },
        },
        {
            field: 'fecha_registro_de_actividad_en_toa',
            headerName: 'F. Registro',
            type: 'dateTime',
            valueGetter: (value) => new Date(value),
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
            field: 'settlement_date',
            headerName: 'F. Liquidación',
            type: 'dateTime',
            valueGetter: (value) => new Date(value),
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
            field: 'estado_actividad',
            headerName: 'Estado',
        },
        {
            field: 'tecnico',
            headerName: 'Técnico',
        },
    ]
}
