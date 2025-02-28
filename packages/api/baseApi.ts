import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export function getBaseApi(baseUrl: string, resource: string) {
  const target = baseUrl.split('/').at(-1)
  return createApi({
    reducerPath: `${target}${resource}BaseApi`,
    baseQuery: fetchBaseQuery({
      baseUrl,
      credentials: 'include',
    }),
    tagTypes: [] as string[],
    endpoints: () => ({}),
  })
}