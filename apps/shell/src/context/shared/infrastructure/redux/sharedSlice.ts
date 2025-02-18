import { createSlice } from '@reduxjs/toolkit'
import { setStateShared } from './actions'

export const initialState = {
    prueba: ''
}

const slice = createSlice({
    name: 'shared',
    initialState,
    reducers: {
        setState: setStateShared<typeof initialState>
    }
})

export const actions = slice.actions
export const sharedReducer = slice.reducer