import { CustomDialog } from '@shared/ui-library'
import React from 'react'
import { InventoryWinDTO, WINOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columnsInventory } from '../GridCol/columnsInventory'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
}

export function InventoryDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Inventario'
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
            <DataGrid<InventoryWinDTO>
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
