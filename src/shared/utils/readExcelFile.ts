import * as XLSX from 'xlsx'

export function readExcelFile(file: File): Promise<any[][]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const arrayBuffer = e.target?.result;
                if (!arrayBuffer) {
                    reject(new Error('No se pudo leer el archivo'));
                    return;
                }

                // Convertir a binario
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);
                let binary = '';
                for (let i = 0; i < data.length; i++) {
                    binary += String.fromCharCode(data[i]);
                }

                // Leer con SheetJS
                const workbook = XLSX.read(binary, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];

                const range = XLSX.utils.decode_range(sheet['!ref']!);
                const rows: any[][] = [];

                for (let r = range.s.r; r <= range.e.r; r++) {
                    const row: any[] = [];
                    for (let c = range.s.c; c <= range.e.c; c++) {
                        const cellAddress = XLSX.utils.encode_cell({ r, c });
                        const cell = sheet[cellAddress];
                        row.push(cell ? cell.v : null);
                    }
                    rows.push(row);
                }

                resolve(rows);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Error al leer el archivo'))
        reader.readAsArrayBuffer(file)
    })
}
