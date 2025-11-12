import { CustomGridToolbarInputFileUpload } from "@shared/ui/ui-library"
import { useSnackbar } from "notistack"
import * as XLSX from 'xlsx'
import { convertExcelDate } from 'logiflowerp-sdk'

export function InputFileUploadOrder() {

    const { enqueueSnackbar } = useSnackbar()

    const handleFileChange = (files: FileList | null) => {
        try {
            if (!files || files.length === 0) {
                throw new Error('No se seleccionó ningún archivo')
            }

            const file = files[0]
            const fileType = file.type

            const isXLS = fileType === 'application/vnd.ms-excel'
            if (!isXLS) {
                throw new Error('El archivo no es un Excel válido (.xls)')
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const arrayBuffer = e.target?.result;
                if (!arrayBuffer) return;

                // Convertir ArrayBuffer a "binary string" manualmente
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);
                let binary = '';
                for (let i = 0; i < data.length; i++) {
                    binary += String.fromCharCode(data[i]);
                }

                // Leer el binario con SheetJS
                const workbook = XLSX.read(binary, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];

                const range = XLSX.utils.decode_range(sheet['!ref']!);
                const rows: any[] = [];

                for (let r = range.s.r; r <= range.e.r; r++) {
                    const row: any[] = [];
                    for (let c = range.s.c; c <= range.e.c; c++) {
                        const cellAddress = XLSX.utils.encode_cell({ r, c });
                        const cell = sheet[cellAddress];
                        row.push(cell ? cell.v : null);
                    }
                    rows.push(row);
                }

                const [headers, ...dataRows] = rows

                const jsonArray = dataRows.map((row) => {
                    const obj: Record<string, any> = {}
                    headers.forEach((header: string, i: number) => {
                        if ([
                            'fechorasig',
                            'fechorprg',
                            'fechorliq',
                            'fechorinf',
                            'fechorreg',
                            'fechorfin',
                            'fecregratn',
                            'fecprg_mm',
                            'fecvalliq',
                            'fecenvgo',
                        ].includes(header)) {
                            obj[header] = row[i] === null ? new Date(0) : convertExcelDate(row[i])
                        } else if (typeof row[i] === 'string') {
                            obj[header] = row[i].trim()
                        } else {
                            obj[header] = row[i]
                        }
                    })
                    return obj
                })

                console.log('✅ JSON final:', jsonArray)
            }
            reader.readAsArrayBuffer(file)

        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <CustomGridToolbarInputFileUpload
            titleTooltip='Subir Orden CMS'
            handleFileChange={handleFileChange}
            accept='.xls'
        />
    )
}