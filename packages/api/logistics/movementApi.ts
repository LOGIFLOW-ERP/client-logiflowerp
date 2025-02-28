import { createRepository } from '../baseRepository'
import { MovementENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'masters'
const resource = 'movement'

const path = `${schema}/${resource}`

export const movementApi = createRepository<MovementENTITY, number>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetMovementsQuery,
    useGetByIdQuery: useGetMovementByIdQuery,
    useCreateMutation: useCreateMovementMutation,
    useUpdateMutation: useUpdateMovementMutation,
    useDeleteMutation: useDeleteMovementMutation,
} = movementApi;
