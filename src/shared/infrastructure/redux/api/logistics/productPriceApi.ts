import { createRepository } from '../baseRepository'
import { ProductPriceENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi'
import { instanceToPlain } from 'class-transformer'
import { transformErrorResponse } from '../transformErrorResponse'

const schema = 'masters'
const resource = 'productPrice'

const path = `${schema}/${resource}`

export const productPriceApi = createRepository<ProductPriceENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            insertBulkProductPrice: builder.mutation<void, Record<string, any>[]>({
                query: (data) => ({
                    url: `${path}/insert-bulk`,
                    method: 'POST',
                    body: instanceToPlain(data),
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` }
                ],
                transformErrorResponse
            }),
        })
    })

export const {
    useGetAllQuery: useGetProductPricesQuery,
    useGetByIdQuery: useGetProductPriceByIdQuery,
    useCreateMutation: useCreateProductPriceMutation,
    useUpdateMutation: useUpdateProductPriceMutation,
    useDeleteMutation: useDeleteProductPriceMutation,
    useInsertBulkProductPriceMutation
} = productPriceApi;
