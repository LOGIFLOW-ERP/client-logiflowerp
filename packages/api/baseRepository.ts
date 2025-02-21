import {
    Api,
    BaseQueryFn,
    coreModuleName,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    reactHooksModuleName
} from '@reduxjs/toolkit/query/react'

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
                    result ? [{ type: resource, id: 'LIST' }] : [],
            }),
            getById: builder.query<T, ID>({
                query: (id) => `${resource}/${id}`,
            }),
            create: builder.mutation<T, Partial<T>>({
                query: (newItem) => ({
                    url: `${resource}`,
                    method: 'POST',
                    body: newItem,
                }),
                invalidatesTags: [{ type: resource, id: 'LIST' }],
            }),
            update: builder.mutation<T, { id: ID; data: Partial<T> }>({
                query: ({ id, data }) => ({
                    url: `${resource}/${id}`,
                    method: 'PUT',
                    body: data,
                }),
                invalidatesTags: [{ type: resource, id: 'LIST' }],
            }),
            delete: builder.mutation<void, ID>({
                query: (id) => ({
                    url: `${resource}/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: [{ type: resource, id: 'LIST' }],
            }),
        }),
    })
}
