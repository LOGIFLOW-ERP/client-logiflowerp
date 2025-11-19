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
            'Número de Peticion': row.numero_de_peticion,
            Actividad: row.subtipo_de_actividad,
        })))

        console.log(dataExport)

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