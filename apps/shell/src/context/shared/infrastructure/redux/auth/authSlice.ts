import { createSlice } from '@reduxjs/toolkit'
import { setStateShared } from '../actions'
import { AuthUserDTO } from 'logiflowerp-sdk'

const authUser = localStorage.getItem('authUser')

export const initialState = {
    user: authUser ? JSON.parse(authUser) as AuthUserDTO : new AuthUserDTO(),
    isAuthenticated: !!authUser,
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
