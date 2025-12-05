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
            {
                dataZones && (
                    <Paper elevation={3}>
                        <BarChart
                            dataset={dataZones.map(item => ({
                                zonaCliente: item.zonaCliente,
                                zonaClasificada: item.zonaClasificada,
                                Anulada: item.resumen.Anulada,
                                Cancelada: item.resumen.Cancelada,
                                Finalizada: item.resumen.Finalizada,
                                Garantia: item.resumen.Garantia,
                                Regetion: item.resumen.Regestion,
                                totalFinalizadas: item.resumen.totalFinalizadas
                            }))}
                            xAxis={[{ dataKey: 'zonaCliente' }]}
                            yAxis={[
                                {
                                    label: 'Cantidad de órdenes',
                                    width: 60,
                                },
                            ]}
                            height={300}
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
                )
            }
            {
                dataProduction && (
                    <Paper elevation={3}>
                        <BarChart
                            layout="horizontal"
                            xAxis={[
                                {
                                    tickMinStep: 1
                                }
                            ]}
                            yAxis={[
                                {
                                    data: dataProduction.map(item => item.tecnico),
                                    scaleType: 'band',
                                    width: 350,
                                    groups: [
                                        { getValue: (category) => category },
                                    ],
                                },
                            ]}
                            series={[
                                {
                                    data: dataProduction.map(item => item.resumenEstado.Anulada),
                                    label: 'Anulada',
                                    barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                                },
                                {
                                    data: dataProduction.map(item => item.resumenEstado.Cancelada),
                                    label: 'Cancelada',
                                    barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                                },
                                {
                                    data: dataProduction.map(item => item.resumenEstado.Finalizada),
                                    label: 'Finalizada',
                                    barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                                },
                                {
                                    data: dataProduction.map(item => item.resumenEstado.Garantia),
                                    label: 'Garantia',
                                    barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                                },
                                {
                                    data: dataProduction.map(item => item.resumenEstado.Regestion),
                                    label: 'Regestión',
                                    barLabel: (v) => v.value === 0 ? undefined : `${v.value}`,
                                },
                            ]}
                            height={dataProduction.length * 120}
                        />
                    </Paper>
                )
            }
        </Box>
    )
}