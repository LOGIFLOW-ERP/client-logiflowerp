import { createSlice } from '@reduxjs/toolkit'
import { setStateShared } from '../actions'
import { AuthUserDTO, CompanyDTO, ProfileDTO, ResponseSignIn, SystemOptionENTITY } from 'logiflowerp-sdk'

const authUser = localStorage.getItem('authUser')
let user = new AuthUserDTO()
let company = new CompanyDTO()
let profile = new ProfileDTO()
let root = false
let dataSystemOptions: SystemOptionENTITY[] = []
let tags: string[] = []
if (authUser) {
    const {
        user: _user,
        dataSystemOptions: _dataSystemOptions,
        company: _company,
        profile: _profile,
        root: _root,
        tags: _tags
    } = JSON.parse(authUser) as ResponseSignIn
    user = _user
    dataSystemOptions = _dataSystemOptions
    company = _company
    profile = _profile
    root = _root
    tags = _tags
}

export const initialState = {
    user,
    isAuthenticated: !!authUser,
    dataSystemOptions,
    company,
    profile,
    root,
    tags
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setState: setStateShared<typeof initialState>
    }
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
