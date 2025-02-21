import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export function getBaseApi(baseUrl: string) {
  const target = baseUrl.split('/').at(-1)
  return createApi({
    reducerPath: `${target}BaseApi`,
    baseQuery: fetchBaseQuery({
      baseUrl,
      credentials: 'include',
    }),
    tagTypes: [] as string[],
    endpoints: () => ({}),
  })
}