import { GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid'
import { StateInternalOrderWin, StateOrderWin, WINOrderENTITY } from 'logiflowerp-sdk'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import { ReactElement } from 'react'
import { Chip } from '@mui/material'
import { CustomCellInfo } from '@shared/ui/ui-library'

interface IParams {
    handleInventoryClick: (row: WINOrderENTITY) => void
    handleDireccionClienteClick: (row: WINOrderENTITY) => void
    handleEstadosClick: (row: WINOrderENTITY) => void
    handleEstadosInternoClick: (row: WINOrderENTITY) => void
}

export const columns = (params: IParams): GridColDef<WINOrderENTITY>[] => {
    const {
        handleInventoryClick,
        handleDireccionClienteClick,
        handleEstadosClick,
        handleEstadosInternoClick
    } = params
    return [
        {
            field: 'Acciones',
            type: 'actions',
            getActions: (params) => {
                const actions: ReactElement<GridActionsCellItemProps>[] = []
                actions.push(
                    <GridActionsCellItem
                        key='inventory'
                        icon={<ViewHeadlineIcon color='primary' fontSize='small' />}
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
            headerName: 'Número Petición',
        },
        {
            field: 'fecha_visita',
            headerName: 'F. Agenda',
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
            field: 'prioridad',
            headerName: 'Prioridad',
            renderCell: ({ value }) => {
                if (!value) return value
                let color: 'info' | 'error' | 'success' | 'primary' | 'default' | 'secondary' | 'warning' = 'info'
                switch (value) {
                    case 'Inmediata':
                        color = 'error'
                        break
                    case 'Media':
                        color = 'info'
                        break
                    case 'Alta':
                        color = 'warning'
                        break
                }
                return (
                    <Chip label={value} color={color} size='small' />
                )
            }
        },
        {
            field: 'movil',
            headerName: 'Contacto',
        },
        {
            field: 'direccion_cliente',
            valueGetter: (value: any) => value.zona,
            headerName: 'Zona',
            renderCell: ({ value, row }) => {
                return (
                    <CustomCellInfo
                        value={value}
                        onClick={() => handleDireccionClienteClick(row)}
                    />
                )
            }
        },
        {
            field: 'inicio_visita',
            headerName: 'F. Inicio',
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
            field: 'fin_visita',
            headerName: 'F. Fin',
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
            field: 'estado',
            headerName: 'Estado',
            renderCell: ({ value, row }) => {
                let backgroundColor = ''
                let color = 'black'
                switch (value) {
                    case StateOrderWin.FINALIZADA:
                        backgroundColor = 'green'
                        color = 'white'
                        break

                    default:
                        break
                }

                return (
                    <CustomCellInfo
                        value={value}
                        onClick={() => handleEstadosClick(row)}
                        sx={{
                            backgroundColor,
                            color,
                            px: 1,
                        }}
                    />
                )
            }
        },
        {
            field: 'estado_interno',
            headerName: 'Estado Interno',
            renderCell: ({ value, row }) => {
                let backgroundColor = ''
                let color = 'black'
                switch (value) {
                    case StateInternalOrderWin.FINALIZADA:
                        backgroundColor = 'green'
                        color = 'white'
                        break
                    case StateInternalOrderWin.REVISION:
                        backgroundColor = 'red'
                        color = 'white'
                        break

                    default:
                        break
                }

                return (
                    <CustomCellInfo
                        value={value}
                        onClick={() => handleEstadosInternoClick(row)}
                        sx={{
                            backgroundColor,
                            color,
                            px: 1,
                        }}
                    />
                )
            }
        },
        {
            field: 'tecnico',
            headerName: 'Técnico',
        },
    ]
}
