import { createRepository } from '../baseRepository'
import { ProductENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';
import { instanceToPlain } from 'class-transformer';

const schema = 'masters'
const resource = 'product'

const path = `${schema}/${resource}`

export const productApi = createRepository<ProductENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            insertBulkProduct: builder.mutation<void, Record<string, any>[]>({
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
    useGetAllQuery: useGetProductsQuery,
    useGetByIdQuery: useGetProductByIdQuery,
    useCreateMutation: useCreateProductMutation,
    useUpdateMutation: useUpdateProductMutation,
    useDeleteMutation: useDeleteProductMutation,
    useGetPipelineQuery: useGetProductPipelineQuery,
    useLazyGetPipelineQuery: useLazyGetProductPipelineQuery,
    useInsertBulkProductMutation
} = productApi;
