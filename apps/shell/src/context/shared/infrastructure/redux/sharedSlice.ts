import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { setStateShared } from './actions'

export const initialState = {
    axiosInstance: axios.create(),
    prueba: ''
}

const slice = createSlice({
    name: 'shared',
    initialState,
    reducers: {
        setState: setStateShared<typeof initialState>
    }
})

export const sharedActionsActios = slice.actions
export const sharedReducer = slice.reducer