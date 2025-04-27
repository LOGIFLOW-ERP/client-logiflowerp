import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setStateShared } from '../actions'
import { OrderDetailENTITY, WarehouseExitENTITY } from 'logiflowerp-sdk'

interface WarehouseExitState {
    selectedDocument: WarehouseExitENTITY | null
    selectedDetail: OrderDetailENTITY | null
}

export const initialState: WarehouseExitState = {
    selectedDocument: null,
    selectedDetail: null,
}

const slice = createSlice({
    name: 'warehouseExit',
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<Partial<typeof initialState>>) => {
            setStateShared(state, action)
            if (action.payload.selectedDocument) {
                const previousSelectedDetail = state.selectedDetail
                if (previousSelectedDetail) {
                    const updatedDetail = action.payload.selectedDocument.detail.find(d => d.keyDetail === previousSelectedDetail.keyDetail)
                    state.selectedDetail = updatedDetail ?? null
                }
            }
        }
    }
})

export const warehouseExitActions = slice.actions
export const warehouseExitReducer = slice.reducer
