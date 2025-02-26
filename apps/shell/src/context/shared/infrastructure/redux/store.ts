import { configureStore, Reducer } from '@reduxjs/toolkit'
import { sharedReducer } from './sharedSlice'
import { authReducer } from './auth'
import { authApi } from './toolkit/authApi'
// import { movementApi } from '@shared/api'

export const store = configureStore({
    reducer: {
        shared: sharedReducer,
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer as Reducer,
        // [movementApi.reducerPath]: movementApi.reducer as Reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(authApi.middleware)
            // .concat(movementApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch