import { createRepository } from '../baseRepository'
import {
    EmployeeStockENTITY,
    EmployeeStockENTITYFlat,
    EmployeeStockSerialENTITY,
    ProductOrderDTO
} from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';

const schema = 'reports'
const resource = 'employeeStock'

const path = `${schema}/${resource}`
export const provideTagReportEmployeeStock = { type: path, id: `REPORT${path}` }
export const provideTagReportIndividualEmployeeStock = { type: path, id: `REPORTINDIVIDUAL${path}` }
export const provideTagGetDataLiquidationOrderEmployeeStock = { type: path, id: `GETDATALIQUIDATIONORDER${path}` }

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
            reportIndividual: builder.query<EmployeeStockENTITY[], void>({
                query: () => `${path}/report-individual`,
                providesTags: (result) =>
                    result ? [provideTagReportIndividualEmployeeStock] : [],
                transformErrorResponse
            }),
            getDataLiquidationOrder: builder.query<{ item: ProductOrderDTO, serials: Pick<EmployeeStockSerialENTITY, 'serial' | 'itemCode'>[] }[], void>({
                query: () => `${path}/get-data-liquidation-order`,
                providesTags: (result) =>
                    result ? [provideTagGetDataLiquidationOrderEmployeeStock] : [],
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
    useReportQuery: useReportEmployeeStockQuery,
    useReportIndividualQuery: useReportIndividualEmployeeStockQuery,
    useGetDataLiquidationOrderQuery: useGetDataLiquidationOrderEmployeeStockQuery
} = employeeStockApi;
