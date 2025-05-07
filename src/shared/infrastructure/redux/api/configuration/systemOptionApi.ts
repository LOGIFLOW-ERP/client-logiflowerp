import { createRepository } from '../baseRepository'
import { SystemOptionENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi';

const schema = 'masters'
const resource = 'rootsystemoption'

const path = `${schema}/${resource}`

export const systemOptionApi = createRepository<SystemOptionENTITY, string>(path, getBaseApiConfiguration(path))

export const {
    useGetAllQuery: useGetSystemOptionsQuery,
    useGetByIdQuery: useGetSystemOptionByIdQuery,
    useCreateMutation: useCreateSystemOptionMutation,
    useUpdateMutation: useUpdateSystemOptionMutation,
    useDeleteMutation: useDeleteSystemOptionMutation,
    useGetPipelineQuery: useGetSystemOptionsPipelineQuery
} = systemOptionApi;
