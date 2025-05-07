import { createRepository } from '../baseRepository'
import { WarehouseStockENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'reports'
const resource = 'warehouseStock'

const path = `${schema}/${resource}`

export const warehouseStockApi = createRepository<WarehouseStockENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetWarehouseStocksQuery,
    useGetByIdQuery: useGetWarehouseStockByIdQuery,
    useCreateMutation: useCreateWarehouseStockMutation,
    useUpdateMutation: useUpdateWarehouseStockMutation,
    useDeleteMutation: useDeleteWarehouseStockMutation,
    useGetPipelineQuery: useGetWarehouseStockPipelineQuery,
} = warehouseStockApi;
