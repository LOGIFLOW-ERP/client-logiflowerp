import { createRepository } from '../baseRepository'
import { ProductENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

export const productApi = createRepository<ProductENTITY, string>('product', getBaseApiLogistics('product'))

export const {
    useGetAllQuery: useGetProductsQuery,
    useGetByIdQuery: useGetProductByIdQuery,
    useCreateMutation: useCreateProductMutation,
    useUpdateMutation: useUpdateProductMutation,
    useDeleteMutation: useDeleteProductMutation,
} = productApi;
