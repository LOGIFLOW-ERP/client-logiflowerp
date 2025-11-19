import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { useSnackbar } from "notistack";
import { RefObject } from "react";
import * as XLSX from "xlsx";

interface Data {
    source: string | Record<string, number | string>[]
    sheetName: string
}

interface ExportExcelProps {
    filenamePrefix: string
    data: Data[]
}

export function useExportExcel<T extends { _id: string }>() {
    const { enqueueSnackbar } = useSnackbar();

    // 🔹 Función que exporta un CSV a Excel
    const exportExcel = (params: ExportExcelProps) => {
        try {
            const workbook = XLSX.utils.book_new()
            for (const element of params.data) {
                if (typeof element.source === 'string') {
                    const json = parseCSV(element.source);
                    if (!json || json.length === 0) throw new Error('No hay datos para exportar');
                    const headers = Object.keys(json[0]);
                    const rows = json.map((obj) => headers.map((key) => obj[key]))
                    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])

                    formatWorksheet(worksheet, headers, rows)

                    XLSX.utils.book_append_sheet(workbook, worksheet, element.sheetName)
                } else if (Array.isArray(element.source)) {
                    const worksheet = XLSX.utils.json_to_sheet(element.source)

                    const headers = Object.keys(element.source[0] || {})
                    const rows = element.source.map(obj => headers.map(key => obj[key]))

                    formatWorksheet(worksheet, headers, rows)

                    XLSX.utils.book_append_sheet(workbook, worksheet, element.sheetName)
                } else {
                    throw new Error('Fuente de datos no válida para exportar a Excel')
                }
            }

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const fileName = `${params.filenamePrefix}_${Date.now()}_${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            enqueueSnackbar("Archivo Excel generado correctamente", { variant: "success" });
        } catch (error) {
            throw error;
        }
    }

    function formatWorksheet(
        worksheet: XLSX.WorkSheet,
        headers: string[],
        rows: any[][]
    ) {
        // Ajustar ancho de columnas
        const colWidths = headers.map((_, colIndex) => {
            const maxLength = Math.max(
                headers[colIndex].toString().length,
                ...rows.map(r => (r[colIndex] ? r[colIndex].toString().length : 0))
            );
            return { wch: maxLength + 2 }
        })
        worksheet['!cols'] = colWidths

        // Activar auto-filter
        worksheet['!autofilter'] = {
            ref: XLSX.utils.encode_range({
                s: { r: 0, c: 0 },
                e: { r: 0, c: headers.length - 1 }
            })
        }
    }

    // 🔹 Parser CSV → JSON
    function parseCSV(csvString: string) {
        const lines = csvString.trim().split(/\r?\n/);
        const headers = parseCSVLine(lines[0]);

        return lines.slice(1).map((line) => {
            const values = parseCSVLine(line);
            const obj: Record<string, any> = {};
            headers.forEach((header, i) => (obj[header] = values[i] ?? null));
            return obj;
        });
    }

    // 🔹 Parser línea CSV respetando comillas
    function parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = "";
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === "," && !insideQuotes) {
                result.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        result.push(current.trim());

        return result.map((val) =>
            val.startsWith('"') && val.endsWith('"')
                ? val.slice(1, -1).trim()
                : val
        );
    }

    function getCsvString(
        apiRef: RefObject<GridApiCommunity | null>,
    ) {
        if (!apiRef.current) {
            throw new Error('apiRef.current is null')
        }
        const csvString = apiRef.current.getDataAsCsv()
        return { csvString }
    }

    function getCsvStringAndFilteredRows(
        apiRef: RefObject<GridApiCommunity | null>,
        rows: T[] | undefined
    ) {
        if (!apiRef.current) {
            throw new Error('apiRef.current is null')
        }
        if (!rows) {
            throw new Error('rows is undefined')
        }
        const csvString = apiRef.current.getDataAsCsv()
        const state = apiRef.current.state
        const filteredLookup = state.filter.filteredRowsLookup
        const filteredRows = rows.filter(el => filteredLookup[el._id] !== false)
        return { csvString, filteredRows }
    }

    return {
        exportExcel,
        getCsvString,
        getCsvStringAndFilteredRows
    }
}
