import { CustomInputFileUpload } from "@shared/ui/ui-library"
import { useSnackbar } from "notistack"
// import * as XLSX from 'xlsx'
// import { validateHeadersExcel } from "@shared/utils"

export function InputFileUploadDetail() {

    const { enqueueSnackbar } = useSnackbar()

    const handleFileChange = (files: FileList | null) => {
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



        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <CustomInputFileUpload
            titleTooltip='Subir Detalle'
            handleFileChange={handleFileChange}
            accept='.xlsx'
        />
    )
}