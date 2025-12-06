import { Box } from "@mui/material"
import { BarChart } from '@mui/x-charts/BarChart'
import {
    useProductionWinReportsQuery,
    useProductionZonesWinReportsQuery
} from "@shared/infrastructure/redux/api"
import Paper from '@mui/material/Paper'
import { CustomViewError } from "@shared/ui/ui-library"

export default function LayoutWinReports() {

    const año = new Date().getFullYear()
    const mes = new Date().getMonth()
    const { data: dataProduction, error: errorProduction, isFetching: isFetchingProduction, isError: isErrorProduction } = useProductionWinReportsQuery({ año, mes })
    const { data: dataZones, error: errorZones, isFetching: isFetchingZones, isError: isErrorZones } = useProductionZonesWinReportsQuery({ año, mes })

    if (isErrorProduction || isErrorZones) return <CustomViewError error={errorProduction || errorZones} />

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={3}>
                <BarChart
                    dataset={(dataZones ?? []).map(item => ({
                        zonaCliente: item.zonaCliente,
                        zonaClasificada: item.zonaClasificada,
                        Anulada: item.resumen.Anulada,
                        Cancelada: item.resumen.Cancelada,
                        Finalizada: item.resumen.Finalizada,
                        Garantia: item.resumen.Garantia,
                        Regetion: item.resumen.Regestion,
                        totalFinalizadas: item.resumen.totalFinalizadas
                    }))}
                    xAxis={[
                        {
                            dataKey: 'zonaCliente',
                            tickLabelStyle: {
                                angle: 90,
                            },
                            height: 180,
                            label: 'Zonas',
                            groups: [
                                { getValue: (category) => category },
                            ]
                        }
                    ]}
                    yAxis={[
                        {
                            label: 'Cantidad de órdenes',
                            width: 60,
                        }
                    ]}
                    height={500}
                    series={[
                        { dataKey: 'Anulada', label: 'Anulada', barLabel: (v) => v.value === 0 ? undefined : `${v.value}` },
                        { dataKey: 'Cancelada', label: 'Cancelada', barLabel: (v) => v.value === 0 ? undefined : `${v.value}` },
                        { dataKey: 'Finalizada', label: 'Finalizada', barLabel: (v) => v.value === 0 ? undefined : `${v.value}` },
                        { dataKey: 'Garantia', label: 'Garantia', barLabel: (v) => v.value === 0 ? undefined : `${v.value}` },
                        { dataKey: 'Regetion', label: 'Regestión', barLabel: (v) => v.value === 0 ? undefined : `${v.value}` },
                        { dataKey: 'totalFinalizadas', label: 'Total Finalizadas', barLabel: (v) => v.value === 0 ? undefined : `${v.value}` }
                    ]}
                    loading={isFetchingProduction || isFetchingZones}
                />
            </Paper>
            <Paper elevation={3}>
                <BarChart
                    dataset={(dataProduction ?? []).map(item => ({
                        tecnico: item.tecnico,
                        Anulada: item.resumenEstado.Anulada,
                        Cancelada: item.resumenEstado.Cancelada,
                        Finalizada: item.resumenEstado.Finalizada,
                        Garantia: item.resumenEstado.Garantia,
                        Regestion: item.resumenEstado.Regestion,
                    }))}
                    xAxis={[
                        {
                            dataKey: 'tecnico',
                            tickLabelStyle: {
                                angle: 90,
                            },
                            height: 410,
                            label: 'Técnicos',
                            groups: [
                                { getValue: (category) => category },
                            ]
                        }
                    ]}
                    yAxis={[
                        {
                            label: 'Cantidad de órdenes',
                            width: 60,
                        },
                    ]}
                    height={730}
                    series={[
                        {
                            dataKey: 'Anulada',
                            label: 'Anulada',
                            barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                        },
                        {
                            dataKey: 'Cancelada',
                            label: 'Cancelada',
                            barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                        },
                        {
                            dataKey: 'Finalizada',
                            label: 'Finalizada',
                            barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                        },
                        {
                            dataKey: 'Garantia',
                            label: 'Garantia',
                            barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                        },
                        {
                            dataKey: 'Regestion',
                            label: 'Regestión',
                            barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                        },
                    ]}
                    loading={isFetchingProduction}
                />
            </Paper>
        </Box>
    )
}