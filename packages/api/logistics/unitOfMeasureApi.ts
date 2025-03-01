import { createRepository } from '../baseRepository'
import { UnitOfMeasureENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'masters'
const resource = 'unitOfMeasure'

const path = `${schema}/${resource}`

export const unitOfMeasureApi = createRepository<UnitOfMeasureENTITY, number>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetUnitOfMeasuresQuery,
    useGetByIdQuery: useGetUnitOfMeasureByIdQuery,
    useCreateMutation: useCreateUnitOfMeasureMutation,
    useUpdateMutation: useUpdateUnitOfMeasureMutation,
    useDeleteMutation: useDeleteUnitOfMeasureMutation,
} = unitOfMeasureApi;
