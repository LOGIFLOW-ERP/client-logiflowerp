import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { useLazyGetWarehouseStockSerialPipelineQuery } from "@shared/infrastructure/redux/api";
import { useExportExcel } from "@shared/ui/hooks";
import { WarehouseStockENTITYFlat, StateStockSerialWarehouse } from "logiflowerp-sdk";
import { RefObject } from "react";

export function useExportExcelWarehouseStock() {
    const { exportExcel, getCsvStringAndFilteredRows } = useExportExcel<WarehouseStockENTITYFlat>()
    const [getWarehouseStockSerialPipeline, { error: errorExportExcel, isLoading: isLoadingExportExcel, isError: isErrorExportExcel }] = useLazyGetWarehouseStockSerialPipelineQuery()

    async function exportExcelWarehouseStock(
        apiRef: RefObject<GridApiCommunity | null>,
        rows: WarehouseStockENTITYFlat[]
    ) {
        const { csvString, filteredRows } = getCsvStringAndFilteredRows(apiRef, rows)

        const keySearch = filteredRows.map(row => row.keySearch)
        const keyDetail = filteredRows.map(row => row.keyDetail)

        const pipeline = [{
            $match: {
                keySearch: { $in: keySearch },
                keyDetail: { $in: keyDetail },
                state: StateStockSerialWarehouse.DISPONIBLE
            }
        }]
        const data = await getWarehouseStockSerialPipeline(pipeline).unwrap()

        const dataExport = (data ?? []).map(s => {
            const row = filteredRows.find(r => r.keySearch === s.keySearch && r.keyDetail === s.keyDetail)
            return {
                Almacén: row?.store_code || '',
                Código: s.itemCode,
                Descripción: row?.item_itemName || '',
                Serie: s.serial,
                Estado: s.state,
                Marca: s.brand,
                Modelo: s.model,
            }
        })

        exportExcel({
            filenamePrefix: 'Stock_Almacen',
            data: [
                { sheetName: 'StockAlmacen', source: csvString },
                { sheetName: 'Series', source: dataExport },
            ]
        })
    }

    return {
        exportExcelWarehouseStock,
        isLoadingExportExcel,
        isErrorExportExcel,
        errorExportExcel
    }
}