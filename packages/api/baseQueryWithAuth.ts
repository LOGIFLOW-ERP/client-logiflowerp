import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const getBaseQueryWithAuth = (baseUrl: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
    const rawBaseQuery = fetchBaseQuery({
        baseUrl,
        credentials: 'include'
    })

    return async (args, api, extraOptions) => {
        const result = await rawBaseQuery(args, api, extraOptions)

        if (result.error?.status === 401) {
            localStorage.removeItem('authUser')
            localStorage.removeItem('selectedNode')
            window.location.reload()
        }

        return result
    }
}
