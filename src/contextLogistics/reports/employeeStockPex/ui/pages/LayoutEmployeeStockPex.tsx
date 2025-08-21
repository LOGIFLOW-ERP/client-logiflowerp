import { useState } from 'react'
import { useSnackbar } from 'notistack'
import {
    useReportEmployeeStockPexQuery,
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { EmployeeStockPEXENTITYFlat } from 'logiflowerp-sdk'
import { GenericDataGrid } from '../GridCol'

export default function LayoutEmployeeStock() {

    const [_openEdit, setOpenEdit] = useState(false)
    const [_selectedRow, setSelectedRow] = useState<EmployeeStockPEXENTITYFlat>()

    const { enqueueSnackbar } = useSnackbar()
    const pipeline = [{ $match: {} }]
    const { data: rows = [], isLoading, isError } = useReportEmployeeStockPexQuery(pipeline)

    const handleEditClick = (row: EmployeeStockPEXENTITYFlat) => {
        try {
            setSelectedRow(row)
            setOpenEdit(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError />

    return (
        <GenericDataGrid<EmployeeStockPEXENTITYFlat>
            rows={rows}
            getRowId={(row) => row._id}
            actions={{
                onEdit: handleEditClick
            }}
            loading={isLoading}
            height={500}
        />
    )
}
