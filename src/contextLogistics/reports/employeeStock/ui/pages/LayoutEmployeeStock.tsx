import { useState } from 'react'
import { useSnackbar } from 'notistack'
import {
    useReportEmployeeStockQuery,
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { EmployeeStockENTITYFlat } from 'logiflowerp-sdk'
import { GenericDataGrid } from '../GridCol'

export default function LayoutEmployeeStock() {

    const [_openEdit, setOpenEdit] = useState(false)
    const [_selectedRow, setSelectedRow] = useState<EmployeeStockENTITYFlat>()

    const { enqueueSnackbar } = useSnackbar()
    const pipeline = [{ $match: {} }]
    const { data: rows = [], isLoading, isError } = useReportEmployeeStockQuery(pipeline)

    const handleEditClick = (row: EmployeeStockENTITYFlat) => {
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
        <GenericDataGrid<EmployeeStockENTITYFlat>
            rows={rows}
            getRowId={(row) => row._id}
            actions={{
                onEdit: handleEditClick
            }}
            excludeFields={['employee_identity', 'employee_company_ruc']}
            renameHeaders={{
                '_id': 'ID',
                'employee_names': 'Nombres',
                'employee_surnames': 'Apellidos'
            }}
            loading={isLoading}
            height={500}
        />
    )
}
