import { createRepository } from '../baseRepository'
import { MovementENTITY } from 'logiflowerp-sdk'
import { baseApi } from './baseApi';

const schema = 'processes'
const resource = 'auth'

export const movementApi = createRepository<MovementENTITY, number>(`${schema}/${resource}`, baseApi)

export const {
    useGetAllQuery: useGetMovementsQuery,
    useGetByIdQuery: useGetMovementtByIdQuery,
    useCreateMutation: useCreateMovementMutation,
    useUpdateMutation: useUpdateMovementMutation,
    useDeleteMutation: useDeleteMovementMutation,
} = movementApi;
