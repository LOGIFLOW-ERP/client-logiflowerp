import { configureStore, Reducer } from '@reduxjs/toolkit'
import { authReducer } from './auth'
import {
    authApi,
    currencyApi,
    movementApi,
    productApi,
    productGroupApi,
    productPriceApi,
    storeApi,
    unitOfMeasureApi,
    companyApi,
    rootCompanyApi,
    systemOptionApi,
    profileApi,
    personnelApi,
    rootUserApi,
    warehouseEntryApi
} from '@shared/api'
import { warehouseEntryReducer } from './warehouseEntry'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        warehouseEntry: warehouseEntryReducer,
        [authApi.reducerPath]: authApi.reducer as Reducer,
        [productGroupApi.reducerPath]: productGroupApi.reducer as Reducer,
        [productApi.reducerPath]: productApi.reducer as Reducer,
        [movementApi.reducerPath]: movementApi.reducer as Reducer,
        [currencyApi.reducerPath]: currencyApi.reducer as Reducer,
        [productPriceApi.reducerPath]: productPriceApi.reducer as Reducer,
        [unitOfMeasureApi.reducerPath]: unitOfMeasureApi.reducer as Reducer,
        [storeApi.reducerPath]: storeApi.reducer as Reducer,
        [companyApi.reducerPath]: companyApi.reducer as Reducer,
        [rootCompanyApi.reducerPath]: rootCompanyApi.reducer as Reducer,
        [systemOptionApi.reducerPath]: systemOptionApi.reducer as Reducer,
        [profileApi.reducerPath]: profileApi.reducer as Reducer,
        [personnelApi.reducerPath]: personnelApi.reducer as Reducer,
        [rootUserApi.reducerPath]: rootUserApi.reducer as Reducer,
        [warehouseEntryApi.reducerPath]: warehouseEntryApi.reducer as Reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(authApi.middleware)
            .concat(productGroupApi.middleware)
            .concat(productApi.middleware)
            .concat(movementApi.middleware)
            .concat(currencyApi.middleware)
            .concat(productPriceApi.middleware)
            .concat(unitOfMeasureApi.middleware)
            .concat(storeApi.middleware)
            .concat(companyApi.middleware)
            .concat(rootCompanyApi.middleware)
            .concat(systemOptionApi.middleware)
            .concat(profileApi.middleware)
            .concat(personnelApi.middleware)
            .concat(rootUserApi.middleware)
            .concat(warehouseEntryApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch