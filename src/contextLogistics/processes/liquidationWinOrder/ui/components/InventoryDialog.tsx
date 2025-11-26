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
import { modelDocumentationLiquidationOrderWin } from '@shared/application/constants'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
    loadingData: boolean
}

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
            title={`Inventario - ${selectedRow.numero_de_peticion}`}
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
                    model={modelDocumentationLiquidationOrderWin}
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
