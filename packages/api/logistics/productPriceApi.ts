import { createRepository } from '../baseRepository'
import { ProductPriceENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi'

const schema = 'masters'
const resource = 'productPrice'

const path = `${schema}/${resource}`

export const productPriceApi = createRepository<ProductPriceENTITY, number>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetProductPricesQuery,
    useGetByIdQuery: useGetProductPriceByIdQuery,
    useCreateMutation: useCreateProductPriceMutation,
    useUpdateMutation: useUpdateProductPriceMutation,
    useDeleteMutation: useDeleteProductPriceMutation,
} = productPriceApi;
