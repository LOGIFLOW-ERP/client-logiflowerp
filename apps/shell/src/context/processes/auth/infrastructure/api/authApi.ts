import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        signIn: builder.query({
            query: () => '/sign-in'
        })
    })
})

export const { useSignInQuery } = authApi