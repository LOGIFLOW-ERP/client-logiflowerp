import { CustomDialog, CustomFileExplorer } from '@shared/ui-library'
import React, { useEffect } from 'react'
import { DeleteInventoryDTO, InventoryWinDTO, WINOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columnsInventory } from '../GridCol/columnsInventory'
import { Box } from '@mui/material'
import { TreeViewBaseItem } from '@mui/x-tree-view'
import {
    useDeleteFileWINOrderMutation,
    useDeleteInventoryWINOrderMutation,
    useUploadFileWINOrderMutation
} from '@shared/infrastructure/redux/api'
import { modelDocumentationLiquidationOrderWin } from '@shared/application/constants'
import { useSnackbar } from 'notistack'
import { useResetApiState } from '@shared/ui/hooks'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
    loadingData: boolean
    isFetching: boolean
}

export function InventoryDialog(props: IProps) {

    const { open, setOpen, selectedRow, loadingData, isFetching } = props
    const apiRef = useGridApiRef()
    const { enqueueSnackbar } = useSnackbar()
    const resetApiState = useResetApiState()
    const [uploadFile, { isLoading }] = useUploadFileWINOrderMutation()
    const [deleteFile, { isLoading: isLoadingDeleteFile }] = useDeleteFileWINOrderMutation()
    const [deleteInventoryOrder, { isLoading: isLoadingDelete }] = useDeleteInventoryWINOrderMutation()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [isLoadingDelete, isFetching])

    const handleFileChange = async (file: File, selectedItem: TreeViewBaseItem<ExtendedTreeItemProps>) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('id', selectedItem.id)
        await uploadFile({ _id: selectedRow._id, formData }).unwrap()
    }

    const handleFileDelete = async (key: string) => {
        await deleteFile({ _id: selectedRow._id, key: key }).unwrap()
    }

    const handleDeleteClick = async (row: InventoryWinDTO) => {
        try {
            const data = new DeleteInventoryDTO()
            data._id_stock = row._id_stock
            data.invsn = row.invsn
            await deleteInventoryOrder({ _id: props.selectedRow._id, data }).unwrap()
            if (row.invsn.length) {
                resetApiState(['employeeStockApi'])
            }
            enqueueSnackbar({ message: '¡Inventario eliminado!', variant: 'info' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
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
                    columns={columnsInventory({ handleDeleteClick })}
                    disableRowSelectionOnClick
                    showToolbar
                    getRowId={row => `${row.code}${row.invsn}`}
                    density='compact'
                    apiRef={apiRef}
                    loading={isLoadingDelete || isFetching}
                />
            </Box>
        </CustomDialog>
    )
}
