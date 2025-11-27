import { createRepository } from '../baseRepository'
import { EmployeeStockSerialENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi'
import { transformErrorResponse } from '../transformErrorResponse'

const schema = 'reports'
const resource = 'employeestockserial'

const path = `${schema}/${resource}`

export const employeeStockSerialApi = createRepository<EmployeeStockSerialENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            getPipelineIndividual: builder.query<EmployeeStockSerialENTITY[], any[]>({
                query: (pipeline) => ({
                    url: `${path}/find-individual`,
                    method: 'POST',
                    body: pipeline
                }),
                providesTags: (result) =>
                    result ? [{ type: path, id: `PIPELINE_INDIVIDUAL${path}` }] : [],
                transformErrorResponse
            }),
        })
    })

export const {
    useLazyGetPipelineQuery: useLazyGetEmployeeStockSerialPipelineQuery,
    useGetPipelineQuery: useGetEmployeeStockSerialPipelineQuery,
    useGetPipelineIndividualQuery: useGetEmployeeStockSerialPipelineIndividualQuery
} = employeeStockSerialApi;
