import { createRepository } from '../baseRepository'
import { StoreENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'masters'
const resource = 'store'

const path = `${schema}/${resource}`

export const storeApi = createRepository<StoreENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetStoresQuery,
    useGetByIdQuery: useGetStoreByIdQuery,
    useCreateMutation: useCreateStoreMutation,
    useUpdateMutation: useUpdateStoreMutation,
    useDeleteMutation: useDeleteStoreMutation,
    useGetPipelineQuery: useGetStorePipelineQuery
} = storeApi;
