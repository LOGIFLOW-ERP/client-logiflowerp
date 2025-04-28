import { createRepository } from '../baseRepository'
import { EmployeeENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi';

const schema = 'masters'
const resource = 'personnel'

const path = `${schema}/${resource}`

export const personnelApi = createRepository<EmployeeENTITY, string>(path, getBaseApiConfiguration(path))

export const {
    useGetAllQuery: useGetPersonnelsQuery,
    useGetByIdQuery: useGetPersonnelByIdQuery,
    useCreateMutation: useCreatePersonnelMutation,
    useUpdateMutation: useUpdatePersonnelMutation,
    useDeleteMutation: useDeletePersonnelMutation,
    useGetPipelineQuery: useGetPersonnelPipelineQuery
} = personnelApi;
