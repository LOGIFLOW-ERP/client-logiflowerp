import { createRepository } from '../baseRepository'
import { ProductENTITY } from 'logiflowerp-sdk'
import { baseApi } from './baseApi';

export const productApi = createRepository<ProductENTITY, number>('product', baseApi)

export const {
    useGetAllQuery: useGetProductsQuery,
    useGetByIdQuery: useGetProductByIdQuery,
    useCreateMutation: useCreateProductMutation,
    useUpdateMutation: useUpdateProductMutation,
    useDeleteMutation: useDeleteProductMutation,
} = productApi;
