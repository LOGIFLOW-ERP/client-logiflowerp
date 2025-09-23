import { createRepository } from '../baseRepository'
import { EmployeeStockENTITY, EmployeeStockENTITYFlat } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';

const schema = 'reports'
const resource = 'employeeStock'

const path = `${schema}/${resource}`
export const provideTagReportEmployeeStock = { type: path, id: `REPORT${path}` }

export const employeeStockApi = createRepository<EmployeeStockENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            report: builder.query<EmployeeStockENTITYFlat[], any[]>({
                query: (pipeline) => ({
                    url: `${path}/report`,
                    method: 'POST',
                    body: pipeline
                }),
                providesTags: (result) =>
                    result ? [provideTagReportEmployeeStock] : [],
                transformErrorResponse
            }),
        })
    })

export const {
    useGetAllQuery: useGetEmployeeStocksQuery,
    useGetByIdQuery: useGetEmployeeStockByIdQuery,
    useCreateMutation: useCreateEmployeeStockMutation,
    useUpdateMutation: useUpdateEmployeeStockMutation,
    useDeleteMutation: useDeleteEmployeeStockMutation,
    useGetPipelineQuery: useGetEmployeeStockPipelineQuery,
    useLazyReportQuery: useLazyReportEmployeeStockQuery,
    useReportQuery: useReportEmployeeStockQuery
} = employeeStockApi;
