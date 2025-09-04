import { createRepository } from '../baseRepository'
import { ProductENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'masters'
const resource = 'product'

const path = `${schema}/${resource}`

export const productApi = createRepository<ProductENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetProductsQuery,
    useGetByIdQuery: useGetProductByIdQuery,
    useCreateMutation: useCreateProductMutation,
    useUpdateMutation: useUpdateProductMutation,
    useDeleteMutation: useDeleteProductMutation,
    useGetPipelineQuery: useGetProductPipelineQuery,
    useLazyGetPipelineQuery: useLazyGetProductPipelineQuery
} = productApi;
