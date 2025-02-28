import { createRepository } from '../baseRepository'
import { ProductGroupENTITY } from 'logiflowerp-sdk'
import { baseApi } from './baseApi';

const schema = 'masters'
const resource = 'productGroup'

export const productGroupApi = createRepository<ProductGroupENTITY, number>(`${schema}/${resource}`, baseApi)

export const {
    useGetAllQuery: useGetProductGroupsQuery,
    useGetByIdQuery: useGetProductGroupByIdQuery,
    useCreateMutation: useCreateProductGroupMutation,
    useUpdateMutation: useUpdateProductGroupMutation,
    useDeleteMutation: useDeleteProductGroupMutation,
} = productGroupApi;
