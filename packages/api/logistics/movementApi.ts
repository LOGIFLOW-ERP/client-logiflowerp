import { createRepository } from '../baseRepository'
import { MovementENTITY } from 'logiflowerp-sdk'
import { baseApi } from './baseApi';

const schema = 'masters'
const resource = 'movement'

export const movementApi = createRepository<MovementENTITY, number>(`${schema}/${resource}`, baseApi)

export const {
    useGetAllQuery: useGetMovementsQuery,
    useGetByIdQuery: useGetMovementByIdQuery,
    useCreateMutation: useCreateMovementMutation,
    useUpdateMutation: useUpdateMovementMutation,
    useDeleteMutation: useDeleteMovementMutation,
} = movementApi;
