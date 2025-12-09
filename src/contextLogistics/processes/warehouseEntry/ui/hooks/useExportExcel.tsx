import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { useExportExcel } from "@shared/ui/hooks";
import { ProducType, WarehouseEntryENTITY } from "logiflowerp-sdk";
import { RefObject } from "react";

interface DataDetail {
    Documento: string
    Codigo: string
    Descripcion: string
    Serial: string
    Cantidad: number
    Lote: string
}

export function useExportExcelWarehouseEntry() {
    const { exportExcel, getCsvStringAndFilteredRows } = useExportExcel<WarehouseEntryENTITY>()

    function exportExcelWarehouseEntry(
        apiRef: RefObject<GridApiCommunity | null>,
        rows: WarehouseEntryENTITY[]
    ) {
        const { csvString, filteredRows } = getCsvStringAndFilteredRows(apiRef, rows)

        const dataExport: DataDetail[] = filteredRows.flatMap(row => row.detail.flatMap(detail => {
            const data: DataDetail[] = []
            if (detail.item.producType === ProducType.SERIE) {
                detail.serials.forEach(serial => {
                    data.push({
                        Documento: row.documentNumber,
                        Codigo: detail.item.itemCode,
                        Descripcion: detail.item.itemName,
                        Serial: serial.serial,
                        Cantidad: 1,
                        Lote: detail.lot,
                    })
                })
            } else {
                data.push({
                    Documento: row.documentNumber,
                    Codigo: detail.item.itemCode,
                    Descripcion: detail.item.itemName,
                    Serial: '',
                    Cantidad: detail.amount,
                    Lote: detail.lot,
                })
            }
            return data
        }))

        const dataForExcel = dataExport.map(d => ({
            Documento: d.Documento,
            Codigo: d.Codigo,
            Descripcion: d.Descripcion,
            Serial: d.Serial,
            Cantidad: d.Cantidad,
            Lote: d.Lote,
        }))

        exportExcel({
            filenamePrefix: 'Ingreso_Almacen',
            data: [
                { sheetName: 'Documentos', source: csvString },
                { sheetName: 'Detalles', source: dataForExcel },
            ]
        })
    }

    return { exportExcelWarehouseEntry }
}