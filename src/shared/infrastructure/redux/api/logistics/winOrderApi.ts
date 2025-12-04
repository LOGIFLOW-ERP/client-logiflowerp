import { createRepository } from '../baseRepository'
import { WINOrderENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';
const schema = 'processes'
const resource = 'winorder'

const path = `${schema}/${resource}`

export const winOrderApi = createRepository<WINOrderENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            finalizeOrder: builder.mutation<void, string>({
                query: (_id) => ({
                    url: `${path}/finalize-order/${_id}`,
                    method: 'PUT',
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` }
                ],
                transformErrorResponse
            }),
            pendingOrder: builder.mutation<void, string>({
                query: (_id) => ({
                    url: `${path}/pending-order/${_id}`,
                    method: 'PUT',
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` }
                ],
                transformErrorResponse
            })
        })
    })

export const {
    useGetPipelineQuery: useGetWinOrderPipelineQuery,
    useLazyGetPipelineQuery: useLazyGetWinOrderPipelineQuery,
    useFinalizeOrderMutation: useFinalizeOrderWinOrderMutation,
    usePendingOrderMutation: usePendingOrderWinOrderMutation
} = winOrderApi;
