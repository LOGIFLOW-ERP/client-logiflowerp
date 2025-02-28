import { createSlice } from '@reduxjs/toolkit'
import { setStateShared } from '../actions'
import { AuthUserDTO, ResponseSignIn, SystemOptionENTITY } from 'logiflowerp-sdk'

const authUser = localStorage.getItem('authUser')
let user = new AuthUserDTO()
let dataSystemOptions: SystemOptionENTITY[] = []
if (authUser) {
    const { user: _user, dataSystemOptions: _dataSystemOptions } = JSON.parse(authUser) as ResponseSignIn
    user = _user
    dataSystemOptions = _dataSystemOptions
}

export const initialState = {
    user,
    isAuthenticated: !!authUser,
    dataSystemOptions
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
