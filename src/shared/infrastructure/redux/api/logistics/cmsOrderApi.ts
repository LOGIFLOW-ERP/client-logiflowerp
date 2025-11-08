import { createRepository } from '../baseRepository'
import { CMSOrderENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
const schema = 'processes'
const resource = 'cmsorder'

const path = `${schema}/${resource}`

export const cmsOrderApi = createRepository<CMSOrderENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetPipelineQuery: useGetCmsOrderPipelineQuery,
    useLazyGetPipelineQuery: useLazyGetCmsOrderPipelineQuery
} = cmsOrderApi;
