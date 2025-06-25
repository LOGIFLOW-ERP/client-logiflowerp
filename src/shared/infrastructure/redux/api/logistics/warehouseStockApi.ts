import { createRepository } from '../baseRepository'
import { WarehouseStockENTITYFlat, WarehouseStockENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';

const schema = 'reports'
const resource = 'warehouseStock'

const path = `${schema}/${resource}`

export const warehouseStockApi = createRepository<WarehouseStockENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            report: builder.query<WarehouseStockENTITYFlat[], any[]>({
                query: (pipeline) => ({
                    url: `${resource}/report`,
                    method: 'POST',
                    body: pipeline
                }),
                providesTags: (result) =>
                    result ? [{ type: resource, id: `REPORT${resource}` }] : [],
                transformErrorResponse
            }),
        })
    })

export const {
    useGetAllQuery: useGetWarehouseStocksQuery,
    useGetByIdQuery: useGetWarehouseStockByIdQuery,
    useCreateMutation: useCreateWarehouseStockMutation,
    useUpdateMutation: useUpdateWarehouseStockMutation,
    useDeleteMutation: useDeleteWarehouseStockMutation,
    useGetPipelineQuery: useGetWarehouseStockPipelineQuery,
    useLazyReportQuery: useLazyReportWarehouseStockQuery
} = warehouseStockApi;
