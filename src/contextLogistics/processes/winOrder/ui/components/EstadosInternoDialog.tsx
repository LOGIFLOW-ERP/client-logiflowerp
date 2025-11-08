import { CustomDialog } from '@shared/ui-library'
import React from 'react'
import { HistorialEstadosDTO, WINOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { useGridApiRef } from '@mui/x-data-grid'
import { columnsEstados } from '../GridCol/columnsEstados'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
}

export function EstadosInternoDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Estados'
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
            <DataGrid<HistorialEstadosDTO>
                rows={selectedRow.historial_estados_interno}
                columns={columnsEstados()}
                disableRowSelectionOnClick
                showToolbar
                getRowId={row => `${row.estado}${row.fecha}`}
                density='compact'
                apiRef={apiRef}
            />
        </CustomDialog>
    )
}
