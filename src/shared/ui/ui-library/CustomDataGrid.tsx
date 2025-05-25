import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridEventListener,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlotProps,
    GridValidRowModel,
    GridCellParams,
    GridTreeNode,
    GridRowIdGetter,
} from '@mui/x-data-grid'

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
        <GridToolbarContainer>
            {
                buttonCreate && (
                    <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                        Crear
                    </Button>
                )
            }
        </GridToolbarContainer>
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
        buttonCreate
    } = props

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
                height: 500,
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
                density='compact'
                onProcessRowUpdateError={(error) => {
                    console.error("Error en la actualización de fila:", error)
                }}
                isCellEditable={isCellEditable}
                getRowId={getRowId ? getRowId : (row) => row._id}
                loading={loading}
            />
        </Box>
    )
}
