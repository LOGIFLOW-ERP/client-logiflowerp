import { CustomDialog } from '@shared/ui-library'
import React from 'react'
import { InventoryDTO, TOAOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { columnsInventory } from '../GridCol'
import { useGridApiRef } from '@mui/x-data-grid'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: TOAOrderENTITY
}

export function InventoryDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Inventario'
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
            <DataGrid<InventoryDTO>
                rows={selectedRow.inventory}
                columns={columnsInventory()}
                disableRowSelectionOnClick
                showToolbar
                getRowId={row => `${row.code}${row.invsn}`}
                density='compact'
                apiRef={apiRef}
            />
        </CustomDialog>
    )
}
