import { DataGrid, useGridApiRef } from "@mui/x-data-grid"
import { CustomButtonSearch, CustomDialog, CustomViewError } from "@shared/ui/ui-library"
import { DataSerialTracking, SerialTrackingDTO, validateCustom } from "logiflowerp-sdk"
import { columnsOrder } from "../GridCol/columnsWarehouseStockSerial"
import { useEffect, useState } from "react"
import { useLazySerialTrackingQuery } from "@shared/infrastructure/redux/api"
import { Box, Tooltip } from "@mui/material"
import { useSnackbar } from "notistack"
import TextareaAutosize from '@mui/material/TextareaAutosize';

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function SerialTracking(props: IProps) {
    const { open, setOpen } = props

    const apiRef = useGridApiRef()
    const [triggerSerialTracking, { data, isFetching, isError, error }] = useLazySerialTrackingQuery()
    const { enqueueSnackbar } = useSnackbar()
    const [seriesText, setSeriesText] = useState('')

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [isFetching])

    const onSubmit = async () => {
        try {
            const _series = seriesText
                .split(/[\n\s]+/)     // separa por línea
                .map(s => s.trim())   // quita espacios
                .filter(Boolean)      // elimina líneas vacías

            const series: SerialTrackingDTO[] = []
            for (const serial of [...new Set(_series)]) {
                series.push(await validateCustom({ serial }, SerialTrackingDTO, Error))
            }
            await triggerSerialTracking(series).unwrap()
            enqueueSnackbar({ message: 'Búsqueda finalizada!', variant: 'info' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Seguimiento de serie'
            maxWidth='xl'
        >
            {
                isError
                    ? (
                        <CustomViewError error={error} />
                    )
                    : <>
                        <Box
                            component='form'
                            onSubmit={(e) => {
                                e.preventDefault()
                                onSubmit()
                            }}
                            style={{ display: 'flex', gap: 8, alignItems: 'end' }}
                        >
                            <Tooltip title='Las series deben estar separadas por espacios o saltos de línea'>
                                <TextareaAutosize
                                    value={seriesText}
                                    onChange={(e) => setSeriesText(e.target.value)}
                                    minRows={2}
                                    maxRows={5}
                                    placeholder='Ingrese las series'
                                    style={{ width: 180, fontSize: 16 }}
                                />
                            </Tooltip>
                            <Box>
                                <CustomButtonSearch
                                    isLoading={isFetching}
                                    size='medium'
                                />
                            </Box>
                        </Box>
                        <DataGrid<DataSerialTracking>
                            rows={data}
                            columns={columnsOrder()}
                            disableRowSelectionOnClick
                            showToolbar
                            getRowId={row => row._id}
                            density='compact'
                            apiRef={apiRef}
                            loading={isFetching}
                        />
                    </>
            }
        </CustomDialog>
    )
}