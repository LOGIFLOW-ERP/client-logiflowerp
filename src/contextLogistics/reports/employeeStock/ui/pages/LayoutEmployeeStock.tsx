import { useEffect, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import {
    useReportEmployeeStockQuery,
} from '@shared/api'
import { CustomViewError } from '@shared/ui-library'
import { EmployeeStockENTITYFlat } from 'logiflowerp-sdk'
// import { columns_ } from '../GridCol/columns_'
import { columns } from '../GridCol/columns'
import { Paper, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

export default function LayoutEmployeeStock() {


    const [_openEdit, setOpenEdit] = useState(false)

    const [_selectedRow, setSelectedRow] = useState<EmployeeStockENTITYFlat>()

    const apiRef = useGridApiRef()

    const { enqueueSnackbar } = useSnackbar()


    const pipeline = [{ $match: {} }]
    const { data, isLoading, isError, error } = useReportEmployeeStockQuery(pipeline)

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [
        data,
        isLoading
    ])

    const handleScannClick = (row: EmployeeStockENTITYFlat) => {
        try {
            setSelectedRow(row)
            setOpenEdit(true)
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError error={error} />


    return (
        <>
            <Paper elevation={2} sx={{ height: '89vh', width: '100%', p: 2, position: 'relative' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Stock Personal</Typography>
                </Box>
                <Box sx={{ height: '94%' }}>
                    <DataGrid<EmployeeStockENTITYFlat>
                        rows={data}
                        columns={columns({ handleScannClick })}
                        disableRowSelectionOnClick
                        showToolbar
                        getRowId={row => row._id}
                        loading={isLoading}
                        autoPageSize
                        density='compact'
                        apiRef={apiRef}
                    />
                </Box>
            </Paper>

        </>
    )
}
