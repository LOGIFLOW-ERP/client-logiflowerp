import { CustomDialog, CustomFileExplorer } from '@shared/ui-library'
import React from 'react'
import { InventoryWinDTO, WINOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columnsInventory } from '../GridCol/columnsInventory'
import { Box } from '@mui/material'
import { TreeViewBaseItem } from '@mui/x-tree-view'
import {
    useDeleteFileWINOrderMutation,
    useUploadFileWINOrderMutation
} from '@shared/infrastructure/redux/api'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
    loadingData: boolean
}

const model: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
    {
        id: '7a6c4a6d-6cd3-42be-b1ff-4dd0df457682',
        label: 'Fotos',
        children: [
            {
                id: 'f38f4748-2b0f-4911-9eef-2f04880595f5',
                label: 'Acta',
                fileType: 'image',
            },
            {
                id: 'd38a3943-a7eb-4ae2-9f12-5283768c2137',
                label: 'CTO',
                fileType: 'image'
            },
            {
                id: '267f8438-69b3-4433-9df1-915d6372928e',
                label: 'Fachada',
                fileType: 'image'
            }
        ]
    }
]

export function InventoryDialog(props: IProps) {

    const { open, setOpen, selectedRow, loadingData } = props
    const apiRef = useGridApiRef()
    const [uploadFile, { isLoading }] = useUploadFileWINOrderMutation()
    const [deleteFile, { isLoading: isLoadingDeleteFile }] = useDeleteFileWINOrderMutation()

    const handleFileChange = async (file: File, selectedItem: TreeViewBaseItem<ExtendedTreeItemProps>) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('id', selectedItem.id)
        await uploadFile({ _id: selectedRow._id, formData }).unwrap()
    }

    const handleFileDelete = async (key: string) => {
        await deleteFile({ _id: selectedRow._id, key: key }).unwrap()
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
                <CustomFileExplorer
                    model={model}
                    files={selectedRow.fotos}
                    handleFileChange={handleFileChange}
                    handleFileDelete={handleFileDelete}
                    loading={isLoading || isLoadingDeleteFile || loadingData}
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
