import { DataGrid, useGridApiRef } from "@mui/x-data-grid"
import { CustomButtonSave, CustomDialog, CustomViewError } from "@shared/ui/ui-library"
import { OrderENTITY, SerialTrackingDTO } from "logiflowerp-sdk"
import { columnsOrder } from "../GridCol/columnsWarehouseStockSerial"
import { useEffect } from "react"
import { useLazySerialTrackingQuery } from "@shared/infrastructure/redux/api"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"
import { useForm } from "react-hook-form"
import { TextField } from "@mui/material"
import { useSnackbar } from "notistack"

const resolver = classValidatorResolver(SerialTrackingDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export function SerialTracking(props: IProps) {
    const { open, setOpen } = props

    const apiRef = useGridApiRef()
    const [triggerSerialTracking, { data, isLoading, isError, error }] = useLazySerialTrackingQuery()
    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [data])

    const onSubmit = async (data: SerialTrackingDTO) => {
        try {
            await triggerSerialTracking(data).unwrap()
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
            title='Seguimiento en serie'
        >
            {
                isError
                    ? (
                        <CustomViewError error={error} />
                    )
                    : <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label='Serie'
                                variant='outlined'
                                fullWidth
                                margin='normal'
                                size='small'
                                {...register('serial')}
                                error={!!errors.serial}
                                helperText={errors.serial?.message}
                            />
                            <CustomButtonSave isLoading={isLoading} />
                        </form>
                        <DataGrid<OrderENTITY>
                            rows={data}
                            columns={columnsOrder()}
                            disableRowSelectionOnClick
                            showToolbar
                            getRowId={row => row._id}
                            density='compact'
                            apiRef={apiRef}
                            loading={isLoading}
                        />
                    </>
            }
        </CustomDialog>
    )
}