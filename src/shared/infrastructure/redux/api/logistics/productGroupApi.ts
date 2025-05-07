import { createRepository } from '../baseRepository'
import { ProductGroupENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'masters'
const resource = 'productGroup'

const path = `${schema}/${resource}`

export const productGroupApi = createRepository<ProductGroupENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetProductGroupsQuery,
    useGetByIdQuery: useGetProductGroupByIdQuery,
    useCreateMutation: useCreateProductGroupMutation,
    useUpdateMutation: useUpdateProductGroupMutation,
    useDeleteMutation: useDeleteProductGroupMutation,
} = productGroupApi;
