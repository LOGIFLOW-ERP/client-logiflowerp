import { createRepository } from '../baseRepository'
import { CompanyENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi';

const schema = 'masters'
const resource = 'company'

const path = `${schema}/${resource}`

export const companyApi = createRepository<CompanyENTITY, string>(path, getBaseApiConfiguration(path))

export const {
    useGetAllQuery: useGetCompaniesQuery,
    useGetByIdQuery: useGetCompanyByIdQuery,
    useCreateMutation: useCreateCompanyMutation,
    useUpdateMutation: useUpdateCompanyMutation,
    useDeleteMutation: useDeleteCompanyMutation,
    useGetPipelineQuery: useGetCompaniesPipelineQuery
} = companyApi;
