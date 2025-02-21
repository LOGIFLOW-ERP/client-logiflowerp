import { createSlice } from '@reduxjs/toolkit'
import { setStateShared } from '../actions'
import { AuthUserDTO } from 'logiflowerp-sdk'

export const initialState = {
    user: new AuthUserDTO(),
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setState: setStateShared<typeof initialState>
    }
})

export const actions = authSlice.actions
export const authReducer = authSlice.reducer
