import { CustomDialog, FileExplorer } from '@shared/ui-library'
import React from 'react'
import { InventoryWinDTO, WINOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columnsInventory } from '../GridCol/columnsInventory'
import { Box } from '@mui/material'
import { TreeViewBaseItem } from '@mui/x-tree-view'
import { useUploadFileWINOrderMutation } from '@shared/infrastructure/redux/api'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
}

const model: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
    {
        id: '1',
        label: 'Fotos',
        children: [
            {
                id: '1.1.1',
                label: 'Acta',
                fileType: 'image',
            },
            {
                id: '1.1.2',
                label: 'CTO',
                fileType: 'image'
            },
            {
                id: '1.1.3',
                label: 'Fachada',
                fileType: 'image'
            }
        ]
    }
]

export function InventoryDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()
    const [uploadFile, { isLoading }] = useUploadFileWINOrderMutation()

    const handleFileChange = async (file: File, selectedItem: TreeViewBaseItem<ExtendedTreeItemProps>) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('id', selectedItem.id)
        await uploadFile({ _id: selectedRow._id, formData }).unwrap()
    }

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
            <Box component={'div'} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <FileExplorer
                    model={model}
                    files={selectedRow.fotos}
                    handleFileChange={handleFileChange}
                    loading={isLoading}
                />
                <DataGrid<InventoryWinDTO>
                    rows={selectedRow.inventory}
                    columns={columnsInventory()}
                    disableRowSelectionOnClick
                    showToolbar
                    getRowId={row => `${row.code}${row.invsn}`}
                    density='compact'
                    apiRef={apiRef}
                />
            </Box>
        </CustomDialog>
    )
}
