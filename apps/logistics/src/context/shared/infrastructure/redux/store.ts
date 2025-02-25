import { configureStore, Reducer } from '@reduxjs/toolkit'
import { sharedReducer } from './sharedSlice'
import { movementApi } from '@shared/api'

export const store = configureStore({
    reducer: {
        shared: sharedReducer,
        [movementApi.reducerPath]: movementApi.reducer as Reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(movementApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch