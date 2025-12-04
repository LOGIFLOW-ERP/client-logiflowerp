import { createRepository } from '../baseRepository'
import { EmployeeStockSerialENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi'

const schema = 'reports'
const resource = 'employeestockserial'

const path = `${schema}/${resource}`

export const employeeStockSerialApi = createRepository<EmployeeStockSerialENTITY, string>(path, getBaseApiLogistics(path))

export const {
    useLazyGetPipelineQuery: useLazyGetEmployeeStockSerialPipelineQuery,
    useGetPipelineQuery: useGetEmployeeStockSerialPipelineQuery,
    useGetPipelineIndividualQuery: useGetEmployeeStockSerialPipelineIndividualQuery
} = employeeStockSerialApi;
