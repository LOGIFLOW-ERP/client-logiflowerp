import { GridColDef } from '@mui/x-data-grid'
import { HistorialEstadosDTO } from 'logiflowerp-sdk'

export const columnsEstados = (): GridColDef<HistorialEstadosDTO>[] => {
    return [
        {
            field: 'estado',
            headerName: 'Estado',
        },
        {
            field: 'usuario',
            headerName: 'Usuario',
        },
        {
            field: 'fecha',
            headerName: 'Fecha',
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
            field: 'observacion',
            headerName: 'Observación',
        }
    ]
}
