import { createApi } from '@reduxjs/toolkit/query/react'
import { getBaseQueryWithAuth } from './baseQueryWithAuth'

export function getBaseApi(baseUrl: string, resource: string) {
  const target = baseUrl.split('/').at(-1)
  return createApi({
    reducerPath: `${target}${resource}BaseApi`,
    baseQuery: getBaseQueryWithAuth(baseUrl),
    tagTypes: [] as string[],
    endpoints: () => ({}),
  })
}