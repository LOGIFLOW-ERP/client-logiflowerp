import { CustomDialog } from '@shared/ui-library'
import React from 'react'
import { EmployeeStockENTITYFlat } from 'logiflowerp-sdk'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { useGridApiRef } from '@mui/x-data-grid'
import { columnsEmployeeStock } from '../GridCol/columnsEmployeeStock'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    dataES: EmployeeStockENTITYFlat[]
}

export function EmployeeStockDialog(props: IProps) {

    const { open, setOpen, dataES } = props
    const apiRef = useGridApiRef()

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Stock Personal'
            maxWidth='md'
            slotProps={{
                transition: {
                    onEntered: () => {
                        apiRef.current?.autosizeColumns({
                            includeHeaders: true,
                            includeOutliers: true,
                        })
                    }
                }
            }}
        >
            <DataGrid<EmployeeStockENTITYFlat>
                rows={dataES}
                columns={columnsEmployeeStock()}
                disableRowSelectionOnClick
                showToolbar
                getRowId={row => row._id}
                density='compact'
                apiRef={apiRef}
            />
        </CustomDialog>
    )
}
