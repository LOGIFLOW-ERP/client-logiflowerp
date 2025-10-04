import { createRepository } from '../baseRepository'
import { TOAOrderENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
const schema = 'processes'
const resource = 'toaorder'

const path = `${schema}/${resource}`

export const toaOrderApi = createRepository<TOAOrderENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetPipelineQuery: useGetToaOrderPipelineQuery ,
    useLazyGetPipelineQuery: useLazyGetToaOrderPipelineQuery
} = toaOrderApi;
