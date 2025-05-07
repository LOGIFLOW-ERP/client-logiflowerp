import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setStateShared } from '../actions'
import { OrderDetailENTITY, WarehouseEntryENTITY } from 'logiflowerp-sdk'

interface WarehouseEntryState {
    selectedDocument: WarehouseEntryENTITY | null
    selectedDetail: OrderDetailENTITY | null
}

export const initialState: WarehouseEntryState = {
    selectedDocument: null,
    selectedDetail: null,
}

const slice = createSlice({
    name: 'warehouseEntry',
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

export const warehouseEntryActions = slice.actions
export const warehouseEntryReducer = slice.reducer
