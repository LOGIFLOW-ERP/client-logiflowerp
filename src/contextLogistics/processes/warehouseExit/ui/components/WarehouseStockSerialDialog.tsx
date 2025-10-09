import { CustomDialog, CustomViewError } from '@shared/ui-library'
import React, { useEffect } from 'react'
import { OrderDetailENTITY, StateStockSerialWarehouse, WarehouseStockSerialENTITY } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columnsWarehouseStockSerial } from '../GridCol/columnsWarehouseStockSerial'
import { useGetWarehouseStockSerialPipelineQuery } from '@shared/infrastructure/redux/api'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: OrderDetailENTITY
}

export function WarehouseStockSerialDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()
    const pipeline = [{
        $match: {
            keySearch: selectedRow.keySearch,
            keyDetail: selectedRow.keyDetail,
            state: StateStockSerialWarehouse.DISPONIBLE
        }
    }]
    const { data, error, isLoading, isError } = useGetWarehouseStockSerialPipelineQuery(pipeline)

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [data])

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Series'
        >
            {
                isError
                    ? (
                        <CustomViewError error={error} />
                    )
                    : (
                        <DataGrid<WarehouseStockSerialENTITY>
                            rows={data}
                            columns={columnsWarehouseStockSerial()}
                            disableRowSelectionOnClick
                            showToolbar
                            getRowId={row => row._id}
                            density='compact'
                            apiRef={apiRef}
                            loading={isLoading}
                        />
                    )
            }
        </CustomDialog>
    )
}
