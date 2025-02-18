import { configureStore } from '@reduxjs/toolkit'
import { sharedReducer } from './sharedSlice'

export const store = configureStore({
    reducer: {
        [sharedReducer.name]: sharedReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch