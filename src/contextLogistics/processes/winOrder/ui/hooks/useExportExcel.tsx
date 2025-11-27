import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { useExportExcel } from "@shared/ui/hooks";
import { WINOrderENTITY } from "logiflowerp-sdk";
import { RefObject } from "react";

export function useExportExcelWinOrder() {
    const { exportExcel, getCsvStringAndFilteredRows } = useExportExcel<WINOrderENTITY>()

    function exportExcelWinOrder(
        apiRef: RefObject<GridApiCommunity | null>,
        rows: WINOrderENTITY[]
    ) {
        const { csvString, filteredRows } = getCsvStringAndFilteredRows(apiRef, rows)

        const dataExport = filteredRows.flatMap(row => row.inventory.map(inv => ({
            Código: inv.code,
            Descripción: inv.description,
            Cantidad: inv.quantity,
            Serie: inv.invsn,
            Tipo: inv.invpool,
            'N° de Petición': row.numero_de_peticion,
            Fecha: new Date(row.fecha_solicitud).toLocaleString(),
            Cuadrilla: row.resource_id,
            Actividad: row.subtipo_de_actividad,
        })))

        exportExcel({
            filenamePrefix: 'WinOrdenes',
            data: [
                { sheetName: 'Win Ordenes', source: csvString },
                { sheetName: 'Win Ordenes Inventario', source: dataExport },
            ]
        })
    }

    return { exportExcelWinOrder }
}