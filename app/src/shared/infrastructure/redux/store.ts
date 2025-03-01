import { configureStore, Reducer } from '@reduxjs/toolkit'
import { sharedReducer } from './sharedSlice'
import { authReducer } from './auth'
import { authApi, currencyApi, movementApi, productGroupApi } from '@shared/api'

export const store = configureStore({
    reducer: {
        shared: sharedReducer,
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer as Reducer,
        [productGroupApi.reducerPath]: productGroupApi.reducer as Reducer,
        [movementApi.reducerPath]: movementApi.reducer as Reducer,
        [currencyApi.reducerPath]: currencyApi.reducer as Reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(authApi.middleware)
            .concat(productGroupApi.middleware)
            .concat(movementApi.middleware)
            .concat(currencyApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch