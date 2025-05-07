import { createRepository } from '../baseRepository'
import { RootCompanyENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi'
import { transformErrorResponse } from '../transformErrorResponse'

const schema = 'masters'
const resource = 'rootcompany'

const path = `${schema}/${resource}`

export const rootCompanyApi = createRepository<RootCompanyENTITY, string>(path, getBaseApiConfiguration(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            getActive: builder.query<RootCompanyENTITY[], void>({
                query: () => `${path}/get-active`,
                providesTags: (result) =>
                    result ? [{ type: path, id: `LIST1${path}` }] : [],
                transformErrorResponse
            }),
        })
    })

export const {
    useGetAllQuery: useGetRootCompaniesQuery,
    useGetByIdQuery: useGetRootCompanyByIdQuery,
    useCreateMutation: useCreateRootCompanyMutation,
    useUpdateMutation: useUpdateRootCompanyMutation,
    useGetActiveQuery: useGetActiveRootCompaniesQuery
} = rootCompanyApi;
