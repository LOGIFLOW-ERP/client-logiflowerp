import { createSlice } from '@reduxjs/toolkit'
import { setStateShared } from '../actions'

export const initialState = {
    user: null,
    isAuthenticated: false,
    country: '',
    identity: '',
    documentType: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = !!action.payload
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
        },
        setState: setStateShared<typeof initialState>
    }
})

export const actions = authSlice.actions
export const authReducer = authSlice.reducer
