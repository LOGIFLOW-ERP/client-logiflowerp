import { createRepository } from '../baseRepository'
import { WarehouseStockSerialENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi'

const schema = 'reports'
const resource = 'warehousestockserial'

const path = `${schema}/${resource}`

export const warehouseStockSerialApi = createRepository<WarehouseStockSerialENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useLazyGetPipelineQuery: useLazyGetWarehouseStockSerialPipelineQuery,
    useGetPipelineQuery: useGetWarehouseStockSerialPipelineQuery,
} = warehouseStockSerialApi;
