import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setStateShared } from '../actions'
import { OrderDetailENTITY, WarehouseReturnENTITY } from 'logiflowerp-sdk'

interface WarehouseReturnState {
    selectedDocument: WarehouseReturnENTITY | null
    selectedDetail: OrderDetailENTITY | null
}

export const initialState: WarehouseReturnState = {
    selectedDocument: null,
    selectedDetail: null,
}

const slice = createSlice({
    name: 'warehouseReturn',
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

export const warehouseReturnActions = slice.actions
export const warehouseReturnReducer = slice.reducer
