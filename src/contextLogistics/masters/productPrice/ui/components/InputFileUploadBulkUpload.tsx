import { CustomGridToolbarInputFileUpload } from "@shared/ui/ui-library"
import { useSnackbar } from "notistack"
import { readExcelFile, validateHeadersExcel } from "@shared/utils"
import { useInsertBulkProductPriceMutation } from "@shared/infrastructure/redux/api"


export function InputFileUploadBulkUpload() {

    const { enqueueSnackbar } = useSnackbar()
    const [insertBulkProductPrice, { isLoading }] = useInsertBulkProductPriceMutation()

    const handleFileChange = async (files: FileList | null) => {
        try {
            if (!files || files.length === 0) {
                throw new Error('No se seleccionó ningún archivo')
            }

            const file = files[0]
            const fileType = file.type

            const isExcel = fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // .xlsx

            if (!isExcel) {
                throw new Error('El archivo no es un Excel válido (.xlsx)');
            }

            const rows = await readExcelFile(file)
            const [headers, ...dataRows] = rows

            const model = ['Codigo Material', 'Precio', 'Moneda']
            const { matchedModel } = validateHeadersExcel(headers, [model])

            const jsonArray: Record<string, any>[] = []
            dataRows.forEach((row) => {
                const obj: Record<string, any> = {}
                matchedModel.forEach((header) => {
                    if (typeof row[header.i] === 'string') {
                        obj[header.name] = row[header.i].trim()
                    } else {
                        obj[header.name] = row[header.i]
                    }
                })
                if (obj['Codigo Material'] === null) {
                    return
                }
                jsonArray.push(obj)
            })

            // console.log('✅ JSON final:', jsonArray)
            await insertBulkProductPrice(jsonArray).unwrap()

            enqueueSnackbar({ message: '¡Se cargó correctamente!', variant: 'success' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <CustomGridToolbarInputFileUpload
            titleTooltip='¡Cargar precios producto masivo!'
            handleFileChange={handleFileChange}
            accept='.xlsx'
            loading={isLoading}
        />
    )
}