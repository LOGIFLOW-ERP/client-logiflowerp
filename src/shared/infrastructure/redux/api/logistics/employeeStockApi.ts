import { createRepository } from '../baseRepository'
import { EmployeeStockENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'reports'
const resource = 'employeeStock'

const path = `${schema}/${resource}`

export const employeeStockApi = createRepository<EmployeeStockENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetEmployeeStocksQuery,
    useGetByIdQuery: useGetEmployeeStockByIdQuery,
    useCreateMutation: useCreateEmployeeStockMutation,
    useUpdateMutation: useUpdateEmployeeStockMutation,
    useDeleteMutation: useDeleteEmployeeStockMutation,
    useGetPipelineQuery: useGetEmployeeStockPipelineQuery,
} = employeeStockApi;
