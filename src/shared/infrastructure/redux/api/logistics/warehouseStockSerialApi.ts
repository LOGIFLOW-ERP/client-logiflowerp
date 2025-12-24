import { createRepository } from '../baseRepository'
import { DataSerialTracking, SerialTrackingDTO, WarehouseStockSerialENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi'
import { transformErrorResponse } from '../transformErrorResponse'
import { instanceToPlain } from 'class-transformer'

const schema = 'reports'
const resource = 'warehousestockserial'

const path = `${schema}/${resource}`

export const warehouseStockSerialApi = createRepository<WarehouseStockSerialENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            serialTracking: builder.query<DataSerialTracking[], SerialTrackingDTO[]>({
                query: (data) => ({
                    url: `${path}/serial-tracking`,
                    method: 'POST',
                    body: instanceToPlain(data)
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
