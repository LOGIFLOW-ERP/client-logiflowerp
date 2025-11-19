import { CustomDialog, CustomViewError } from '@shared/ui-library'
import React, { useEffect } from 'react'
import { EmployeeStockSerialENTITY, StateStockSerialEmployee, EmployeeStockENTITYFlat } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columnsEmployeeStockSerial } from '../GridCol/columnsEmployeeStockSerial'
import { useGetEmployeeStockSerialPipelineQuery } from '@shared/infrastructure/redux/api'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: EmployeeStockENTITYFlat
}

export function EmployeeStockSerialDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()
    const pipeline = [{
        $match: {
            identity: selectedRow.employee_identity,
            keySearch: selectedRow.keySearch,
            keyDetail: selectedRow.keyDetail,
            state: StateStockSerialEmployee.POSESION
        }
    }]
    const { data, error, isLoading, isError } = useGetEmployeeStockSerialPipelineQuery(pipeline)

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
                        <DataGrid<EmployeeStockSerialENTITY>
                            rows={data}
                            columns={columnsEmployeeStockSerial()}
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
