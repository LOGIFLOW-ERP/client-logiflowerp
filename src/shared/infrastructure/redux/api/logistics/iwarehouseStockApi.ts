import { createRepository } from '../baseRepository'
import { IWarehouseStockENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'reports'
const resource = 'iwarehouseStock'

const path = `${schema}/${resource}`

export const IwarehouseStockApi = createRepository<IWarehouseStockENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetIWarehouseStocksQuery,
    useGetByIdQuery: useGetIWarehouseStockByIdQuery,
    useCreateMutation: useCreateIWarehouseStockMutation,
    useUpdateMutation: useUpdateIWarehouseStockMutation,
    useDeleteMutation: useDeleteIWarehouseStockMutation,
    useGetPipelineQuery: useGetIWarehouseStockPipelineQuery,
}   = IwarehouseStockApi;
