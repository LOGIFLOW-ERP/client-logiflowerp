import { CustomInputFileUpload } from "@shared/ui/ui-library"
import { useSnackbar } from "notistack"
import { readExcelFile, validateHeadersExcel } from "@shared/utils"
import { useAddDetailBulkWarehouseEntryMutation } from "@shared/infrastructure/redux/api"
import { useStore } from "@shared/ui/hooks"

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function InputFileUploadDetail({ setOpen }: IProps) {

    const { state: { selectedDocument } } = useStore('warehouseEntry')
    const { enqueueSnackbar } = useSnackbar()
    const [insertBulk, { isLoading }] = useAddDetailBulkWarehouseEntryMutation()

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

            const model = ['CodMaterial', 'Serie', 'Cantidad']
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
                if (obj['CodMaterial'] === null) {
                    return
                }
                jsonArray.push(obj)
            })

            // console.log('✅ JSON final:', jsonArray)

            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }

            await insertBulk({ _id: selectedDocument.documentNumber, data: jsonArray }).unwrap()
            setOpen(false)

            enqueueSnackbar({
                message: '¡Su solicitud está en proceso, le llegará una notificación al finalizar! (No cargar el archivo hasta recibir informacion de esta solicitud)',
                variant: 'success',
                autoHideDuration: 5000
            })
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
            loading={isLoading}
        />
    )
}