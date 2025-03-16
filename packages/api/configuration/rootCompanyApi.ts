import { createRepository } from '../baseRepository'
import { RootCompanyENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi';

const schema = 'masters'
const resource = 'rootcompany'

const path = `${schema}/${resource}`

export const rootCompanyApi = createRepository<RootCompanyENTITY, number>(path, getBaseApiConfiguration(path))

export const {
    useGetAllQuery: useGetRootCompaniesQuery,
    useGetByIdQuery: useGetRootCompanyByIdQuery,
    useCreateMutation: useCreateRootCompanyMutation,
    useUpdateMutation: useUpdateRootCompanyMutation,
    useDeleteMutation: useDeleteRootCompanyMutation,
} = rootCompanyApi;
