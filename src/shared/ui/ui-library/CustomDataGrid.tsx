import * as React from 'react';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    Toolbar,
    GridEventListener,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlotProps,
    GridValidRowModel,
    GridCellParams,
    GridTreeNode,
    GridRowIdGetter,
    useGridApiRef,
    ToolbarButton,
} from '@mui/x-data-grid'
import { useEffect } from 'react';
import { Divider, Tooltip } from '@mui/material';
import { ToolbarButtonExportSearch } from '../components/ToolbarButtonExportSearch';
import { ToolbarButtonColumnsFilter } from '../components/ToolbarButtonColumnsFilter';

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void;
        newRowTemplate: Record<string, any>
        buttonCreate?: boolean
    }
}

function EditToolbar(props: GridSlotProps['toolbar']) {

    const { setRows, setRowModesModel, newRowTemplate, buttonCreate } = props;

    const handleClick = () => {
        const _id = crypto.randomUUID()
        const { fieldToFocus, ...rowData } = newRowTemplate
        setRows((oldRows) => [
            ...oldRows,
            { ...rowData, _id, isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [_id]: { mode: GridRowModes.Edit, fieldToFocus },
        }));
    };

    return (
        <Toolbar>
            {
                buttonCreate && (
                    <Tooltip title="Agregar nuevo registro">
                        <ToolbarButton
                            aria-describedby="new-panel-add"
                            onClick={handleClick}
                        >
                            <AddIcon fontSize="small" color='success' />
                        </ToolbarButton>
                    </Tooltip>
                )
            }

            <Box sx={{ flexGrow: 1 }} />

            <ToolbarButtonColumnsFilter />

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <ToolbarButtonExportSearch />
        </Toolbar>
    );
}

interface IProps {
    rows: readonly GridValidRowModel[]
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    columns: GridColDef[]
    newRowTemplate: Record<string, any>
    processRowUpdate: (newRow: GridRowModel) => Promise<{ isNew: boolean } | undefined>
    isCellEditable?: ((params: GridCellParams<any, GridValidRowModel, GridValidRowModel, GridTreeNode>) => boolean) | undefined
    loading?: boolean
    getRowId?: GridRowIdGetter | undefined
    buttonCreate?: boolean
    showToolbar?: boolean
    height?: string
}

export function CustomDataGrid(props: IProps) {

    const {
        rows,
        setRows,
        rowModesModel,
        setRowModesModel,
        columns,
        newRowTemplate,
        processRowUpdate,
        isCellEditable,
        loading,
        getRowId,
        buttonCreate,
        showToolbar = true,
        height = '85vh'
    } = props

    const apiRef = useGridApiRef()
    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [rows])

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true
        }
    }

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    }

    return (
        <Box
            sx={{
                height,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{ toolbar: EditToolbar }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel, newRowTemplate, buttonCreate }
                }}
                showToolbar={showToolbar}
                autoPageSize
                density='compact'
                onProcessRowUpdateError={(error) => {
                    console.error("Error en la actualización de fila:", error)
                }}
                isCellEditable={isCellEditable}
                getRowId={getRowId ? getRowId : (row) => row._id}
                loading={loading}
                apiRef={apiRef}
            />
        </Box>
    )
}
