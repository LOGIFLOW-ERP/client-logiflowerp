import {
    Api,
    BaseQueryFn,
    coreModuleName,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    reactHooksModuleName
} from '@reduxjs/toolkit/query/react'
import { transformErrorResponse } from './transformErrorResponse'
import { instanceToPlain } from 'class-transformer'

export const createRepository = <T, ID>(
    resource: string,
    baseApi: Api<
        BaseQueryFn<
            string | FetchArgs,
            unknown,
            FetchBaseQueryError,
            {},
            FetchBaseQueryMeta
        >,
        {},
        `${string}BaseApi`,
        string,
        typeof coreModuleName | typeof reactHooksModuleName
    >
) => {    
    return baseApi.injectEndpoints({
        endpoints: (builder) => ({
            getAll: builder.query<T[], void>({
                query: () => `${resource}`,
                providesTags: (result) =>
                    result ? [{ type: resource, id: `LIST${resource}` }] : [],
                transformErrorResponse
            }),
            getById: builder.query<T, ID>({
                query: (id) => `${resource}/${id}`,
                transformErrorResponse
            }),
            create: builder.mutation<T, Partial<T>>({
                query: (newItem) => ({
                    url: `${resource}`,
                    method: 'POST',
                    body: instanceToPlain(newItem),
                }),
                invalidatesTags: [{ type: resource, id: `LIST${resource}` }],
                transformErrorResponse
            }),
            update: builder.mutation<T, { id: string; data: Partial<T> }>({
                query: ({ id, data }) => ({
                    url: `${resource}/${id}`,
                    method: 'PUT',
                    body: instanceToPlain(data),
                }),
                invalidatesTags: [{ type: resource, id: `LIST${resource}` }],
                transformErrorResponse
            }),
            delete: builder.mutation<void, string>({
                query: (id) => ({
                    url: `${resource}/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: [{ type: resource, id: `LIST${resource}` }],
                transformErrorResponse
            }),
        }),
    })
}
