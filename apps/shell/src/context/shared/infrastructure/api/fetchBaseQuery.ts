import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { store } from './store'
// import { logout } from './authSlice'

// Configuración del baseQuery con un interceptor de errores
const customBaseQuery = fetchBaseQuery({
    baseUrl: 'https://api.example.com',
    credentials: 'include'
})

export const fetchBaseQueryConfiguration = async (args: any, api: any, extraOptions: any) => {
    const result = await customBaseQuery(args, api, extraOptions)

    if (result.error?.status === 401) {
        // store.dispatch(logout()) // Cerrar sesión
        // window.location.href = '/login' // Redirigir al login
    }

    return result
}
