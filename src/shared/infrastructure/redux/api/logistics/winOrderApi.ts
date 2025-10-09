import { createRepository } from '../baseRepository'
import { WINOrderENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
const schema = 'processes'
const resource = 'winorder'

const path = `${schema}/${resource}`

export const winOrderApi = createRepository<WINOrderENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetPipelineQuery: useGetWinOrderPipelineQuery,
    useLazyGetPipelineQuery: useLazyGetWinOrderPipelineQuery
} = winOrderApi;
