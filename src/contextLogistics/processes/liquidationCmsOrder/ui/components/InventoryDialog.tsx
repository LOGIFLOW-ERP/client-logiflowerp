import { CustomDialog } from '@shared/ui-library'
import React, { useEffect } from 'react'
import { InventoryToaDTO, TOAOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columnsInventory } from '../GridCol'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: TOAOrderENTITY
}

export function InventoryDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [selectedRow, open])

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Inventario'
        >
            <DataGrid<InventoryToaDTO>
                rows={selectedRow.inventory}
                columns={columnsInventory()}
                disableRowSelectionOnClick
                showToolbar
                getRowId={row => row.code}
                density='compact'
                apiRef={apiRef}
            />
        </CustomDialog>
    )
}
