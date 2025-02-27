import { useEffect, useState } from 'react'
import {
    GridCellParams,
    GridRowId,
    GridRowModel,
    GridRowModesModel,
    GridValidRowModel,
} from '@mui/x-data-grid'
import { columns } from '../GridCol/columns'
import { MovementENTITY, validateCustom } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import { StoreProvider } from '../../../../shared/ui/providers/StoreProvider'
import React from "react"
import ReactDOM from "react-dom/client"
import r2wc from "react-to-webcomponent"
import { CustomDataGrid, CustomViewError, CustomViewLoading } from '@shared/ui-library'
import { useCreateMovementMutation, useGetMovementsQuery } from '@shared/api'

const LayoutMovement = () => {

    const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const newRowTemplate: Partial<MovementENTITY & { fieldToFocus: keyof MovementENTITY }> = { code: '', name: '', fieldToFocus: 'code' }

    const { enqueueSnackbar } = useSnackbar()
    const { data: movements, error, isLoading } = useGetMovementsQuery()
    const [createMovement, { isLoading: isLoadingCreate }] = useCreateMovementMutation()
    useEffect(() => movements && setRows(movements.map(e => ({ ...e, id: e._id }))), [movements])

    const processRowUpdate = async (newRow: GridRowModel) => {
        const { isNew } = newRow
        const updatedRow = { ...newRow, isNew: false }
        try {
            const entity = new MovementENTITY()
            entity._id = crypto.randomUUID()
            entity.set(newRow)
            const body = await validateCustom(entity, MovementENTITY, Error)
            if (isNew) {
                await createMovement(body).unwrap()
            }
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            return updatedRow
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id))
    }

    const isCellEditable = (p: GridCellParams) => !['code'].includes(p.field) || p.row.isNew

    if (isLoading || isLoadingCreate) return <CustomViewLoading />
    if (error) return <CustomViewError />

    return (
        <CustomDataGrid
            rows={rows}
            setRows={setRows}
            rowModesModel={rowModesModel}
            setRowModesModel={setRowModesModel}
            columns={columns({
                handleDeleteClick,
                rowModesModel,
                setRowModesModel,
                rows,
                setRows
            })}
            newRowTemplate={newRowTemplate}
            processRowUpdate={processRowUpdate}
            isCellEditable={isCellEditable}
        />
    )
}

const WebGreeting = r2wc((props) => (
    <StoreProvider>
        <LayoutMovement {...props} />
    </StoreProvider>
), React, ReactDOM)

export default function WebComponentPage() {
    useEffect(() => {
        if (!customElements.get("layout-movement")) {
            customElements.define("layout-movement", WebGreeting);
        }
    }, []);

    {/* @ts-ignore */ }
    return <layout-movement style={{ width: "100%", height: "100%" }}></layout-movement>
}
