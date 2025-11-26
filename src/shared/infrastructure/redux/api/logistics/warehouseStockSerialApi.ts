import { createRepository } from '../baseRepository'
import { SerialTrackingDTO, WarehouseStockSerialENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi'
import { transformErrorResponse } from '../transformErrorResponse'

const schema = 'reports'
const resource = 'warehousestockserial'

const path = `${schema}/${resource}`

export const warehouseStockSerialApi = createRepository<WarehouseStockSerialENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            serialTracking: builder.query<any[], SerialTrackingDTO>({
                query: (data) => ({
                    url: `${path}/serial-tracking`,
                    method: 'POST',
                    body: data
                }),
                providesTags: (result) =>
                    result ? [{ type: path, id: `SerialTracking${path}` }] : [],
                transformErrorResponse
            }),
        })
    })

export const {
    useLazyGetPipelineQuery: useLazyGetWarehouseStockSerialPipelineQuery,
    useGetPipelineQuery: useGetWarehouseStockSerialPipelineQuery,
    useLazySerialTrackingQuery: useLazySerialTrackingQuery,
} = warehouseStockSerialApi;
