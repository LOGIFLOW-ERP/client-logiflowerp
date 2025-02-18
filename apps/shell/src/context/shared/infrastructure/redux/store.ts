import { configureStore } from '@reduxjs/toolkit'
import { sharedReducer } from './sharedSlice'
import { authReducer } from './auth'

export const store = configureStore({
    reducer: {
        shared: sharedReducer,
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch