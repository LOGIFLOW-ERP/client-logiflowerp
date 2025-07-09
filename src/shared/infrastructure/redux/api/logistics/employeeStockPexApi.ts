import { createRepository } from '../baseRepository'
import { EmployeeStockPEXENTITY, EmployeeStockPEXENTITYFlat } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';

const schema = 'reports'
const resource = 'employeeStockPex'

const path = `${schema}/${resource}`

export const employeeStockPexApi = createRepository<EmployeeStockPEXENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            report: builder.query<EmployeeStockPEXENTITYFlat[], any[]>({
                query: (pipeline) => ({
                    url: `${path}/report`,
                    method: 'POST',
                    body: pipeline
                }),
                providesTags: (result) =>
                    result ? [{ type: path, id: `REPORT${path}` }] : [],
                transformErrorResponse
            }),
        })
    })

export const {
    useGetAllQuery: useGetEmployeeStocksPexQuery,
    useGetByIdQuery: useGetEmployeeStockPexByIdQuery,
    useCreateMutation: useCreateEmployeeStockPexMutation,
    useUpdateMutation: useUpdateEmployeeStockPexMutation,
    useDeleteMutation: useDeleteEmployeeStockPexMutation,
    useGetPipelineQuery: useGetEmployeeStockPexPipelineQuery,
    useLazyReportQuery: useLazyReportEmployeeStockPexQuery,
    useReportQuery: useReportEmployeeStockPexQuery
} = employeeStockPexApi;
