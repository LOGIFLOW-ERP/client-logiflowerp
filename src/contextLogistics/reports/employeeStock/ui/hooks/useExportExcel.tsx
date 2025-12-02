import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { useLazyGetEmployeeStockSerialPipelineQuery } from "@shared/infrastructure/redux/api";
import { useExportExcel } from "@shared/ui/hooks";
import { EmployeeStockENTITYFlat, StateStockSerialEmployee } from "logiflowerp-sdk";
import { RefObject } from "react";

export function useExportExcelEmployeeStock() {
    const { exportExcel, getCsvStringAndFilteredRows } = useExportExcel<EmployeeStockENTITYFlat>()
    const [getEmployeeStockSerialPipeline, { error: errorExportExcel, isLoading: isLoadingExportExcel, isError: isErrorExportExcel }] = useLazyGetEmployeeStockSerialPipelineQuery()

    async function exportExcelEmployeeStock(
        apiRef: RefObject<GridApiCommunity | null>,
        rows: EmployeeStockENTITYFlat[]
    ) {
        const { csvString, filteredRows } = getCsvStringAndFilteredRows(apiRef, rows)

        const identity = filteredRows.map(row => row.employee_identity)
        const keySearch = filteredRows.map(row => row.keySearch)
        const keyDetail = filteredRows.map(row => row.keyDetail)

        const pipeline = [{
            $match: {
                identity: { $in: identity },
                keySearch: { $in: keySearch },
                keyDetail: { $in: keyDetail },
                state: StateStockSerialEmployee.POSESION
            }
        }]
        const data = await getEmployeeStockSerialPipeline(pipeline).unwrap()

        const dataExport = (data ?? []).map(s => {
            const row = filteredRows.find(r => r.employee_identity === s.identity && r.keySearch === s.keySearch && r.keyDetail === s.keyDetail)
            return {
                Código: s.itemCode,
                Descripción: row?.item_itemName || '',
                Lote: row?.lot || '',
                'DNI/CE': s.identity,
                Personal: `${row?.employee_names} ${row?.employee_surnames}`,
                Serie: s.serial,
                Estado: s.state,
                Marca: s.brand,
                Modelo: s.model,
            }
        })

        exportExcel({
            filenamePrefix: 'Stock_Personal',
            data: [
                { sheetName: 'Stock Personal', source: csvString },
                { sheetName: 'Series', source: dataExport },
            ]
        })
    }

    return {
        exportExcelEmployeeStock,
        isLoadingExportExcel,
        isErrorExportExcel,
        errorExportExcel
    }
}