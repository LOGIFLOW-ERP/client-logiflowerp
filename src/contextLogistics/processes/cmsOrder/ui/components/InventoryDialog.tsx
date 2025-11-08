import { CustomDialog } from '@shared/ui-library'
import React from 'react'
import { InventoryWinDTO, CMSOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { columnsInventory } from '../GridCol/columnsInventory'
import { useGridApiRef } from '@mui/x-data-grid'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: CMSOrderENTITY
}

export function InventoryDialog(props: IProps) {

    const { open, setOpen } = props
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
            <DataGrid<InventoryWinDTO>
                rows={[]}
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
