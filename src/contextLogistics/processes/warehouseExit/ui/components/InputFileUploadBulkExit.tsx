import { classValidatorResolver } from "@hookform/resolvers/class-validator"
import { Button, Dialog, DialogActions, DialogContent, } from "@mui/material"
import { useBulkExitWarehouseEntryMutation, useGetStorePipelineQuery } from "@shared/infrastructure/redux/api"
import { CustomGridToolbarInputFileUpload, CustomSelectDto } from "@shared/ui/ui-library"
import { readExcelFile, validateHeadersExcel } from "@shared/utils"
import { CreateWarehouseExitDTO, State, StoreDTO, validateCustom } from "logiflowerp-sdk"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

const resolver = classValidatorResolver(CreateWarehouseExitDTO)

export function InputFileUploadBulkExit() {
    const { enqueueSnackbar } = useSnackbar()
    const [bulkExit, { isLoading }] = useBulkExitWarehouseEntryMutation()
    const pipelineStore = [{ $match: { state: State.ACTIVO } }]
    const { data: dataStores, isLoading: isLoadingStores, isError: isErrorStores } = useGetStorePipelineQuery(pipelineStore)
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<Record<string, any>[]>([])
    const {
        formState: { errors },
        control,
        getValues,
        trigger
    } = useForm({ resolver })

    const handleFileChange = async (files: FileList | null) => {
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

        const model = ['CodMaterial', 'Serie', 'Cantidad', 'Tecnico']
        const { matchedModel } = validateHeadersExcel(headers, [model])

        const jsonArray: Record<string, any>[] = []
        dataRows.forEach((row) => {
            const obj: Record<string, any> = {}
            matchedModel.forEach((header) => {
                if (typeof row[header.i] === 'string') {
                    obj[header.name] = row[header.i].trim()
                } else if (typeof row[header.i] === 'number') {
                    if (header.name === 'Tecnico') {
                        obj[header.name] = row[header.i].toString().padStart(8, '0')
                    } else {
                        obj[header.name] = row[header.i]
                    }
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
        setData(jsonArray)
        setOpen(true)
    }

    const handleSend = async () => {
        try {
            const valid = await trigger('store')
            if (!valid) { return }
            const store = await validateCustom(getValues('store'), StoreDTO, Error)
            await bulkExit({ store, data }).unwrap()
            setOpen(false)
            enqueueSnackbar({ message: '¡Solicitud presentada, recibirá una notificación!', variant: 'info' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' });
        }
    }

    return (
        <>
            <CustomGridToolbarInputFileUpload
                titleTooltip='Subir excel despacho masivo'
                handleFileChange={handleFileChange}
                accept='.xlsx'
            />
            <Dialog
                fullWidth={true}
                maxWidth='sm'
                open={open}
                onClose={() => setOpen(true)}
            >
                <DialogContent>
                    <Controller
                        name='store'
                        control={control}
                        render={({ field }) => (
                            <CustomSelectDto
                                label='Almacén'
                                options={dataStores ?? []}
                                {...field}
                                labelKey='name'
                                valueKey='code'
                                margin='dense'
                                error={!!errors.store}
                                helperText={errors.store?.message}
                                isLoading={isLoadingStores}
                                isError={isErrorStores}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSend}
                        loading={isLoading}
                    >
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}