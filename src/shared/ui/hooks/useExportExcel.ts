import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";

export function useExportExcel() {
    const { enqueueSnackbar } = useSnackbar();

    // 🔹 Función que exporta un CSV a Excel
    const exportExcel = (csv: string, filenamePrefix = "Stock_Almacen") => {
        try {
            const json = parseCSV(csv);
            if (!json || json.length === 0) throw new Error("No hay datos para exportar");

            const headers = Object.keys(json[0]);
            const rows = json.map((obj) => headers.map((key) => obj[key]));

            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const fileName = `${filenamePrefix}_${Date.now()}_${new Date()
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
            console.error(error);
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    };

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

    return { exportExcel }
}
