import { createRepository } from '../baseRepository'
import { UserENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi'

export const userApi = createRepository<UserENTITY, number>('user', getBaseApiConfiguration('user'))

export const {
    useGetAllQuery: useGetUsersQuery,
    useGetByIdQuery: useGetUserByIdQuery,
    useCreateMutation: useCreateUserMutation,
    useUpdateMutation: useUpdateUserMutation,
    useDeleteMutation: useDeleteUserMutation,
} = userApi
