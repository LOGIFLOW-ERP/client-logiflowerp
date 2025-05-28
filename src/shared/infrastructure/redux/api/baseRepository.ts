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
            getPipeline: builder.query<T[], any[]>({
                query: (pipeline) => ({
                    url: `${resource}/find`,
                    method: 'POST',
                    body: pipeline
                }),
                providesTags: (result) =>
                    result ? [{ type: resource, id: `PIPELINE${resource}` }] : [],
                transformErrorResponse
            }),
            getStaticPipeline: builder.query<T[], void>({
                query: () => ({
                    url: `${resource}/find`,
                    method: 'POST',
                    body: []
                }),
                providesTags: (result) =>
                    result ? [{ type: resource, id: `STATIC_PIPELINE${resource}` }] : [],
                transformErrorResponse
            }),
            create: builder.mutation<T, Partial<T>>({
                query: (newItem) => ({
                    url: `${resource}`,
                    method: 'POST',
                    body: instanceToPlain(newItem),
                }),
                invalidatesTags: [
                    { type: resource, id: `LIST${resource}` },
                    { type: resource, id: `LIST1${resource}` },
                    { type: resource, id: `STATIC_PIPELINE${resource}` },
                    { type: resource, id: `PIPELINE${resource}` },
                    { type: resource, id: `REPORT${resource}` },
                ],
                transformErrorResponse
            }),
            update: builder.mutation<T, { id: ID; data: Partial<T> }>({
                query: ({ id, data }) => ({
                    url: `${resource}/${id}`,
                    method: 'PUT',
                    body: instanceToPlain(data),
                }),
                invalidatesTags: [
                    { type: resource, id: `LIST${resource}` },
                    { type: resource, id: `LIST1${resource}` },
                    { type: resource, id: `STATIC_PIPELINE${resource}` },
                    { type: resource, id: `PIPELINE${resource}` },
                    { type: resource, id: `REPORT${resource}` },
                ],
                transformErrorResponse
            }),
            delete: builder.mutation<void, ID>({
                query: (id) => ({
                    url: `${resource}/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: [
                    { type: resource, id: `LIST${resource}` },
                    { type: resource, id: `LIST1${resource}` },
                    { type: resource, id: `STATIC_PIPELINE${resource}` },
                    { type: resource, id: `PIPELINE${resource}` },
                    { type: resource, id: `REPORT${resource}` },
                ],
                transformErrorResponse
            }),
        }),
    })
}
