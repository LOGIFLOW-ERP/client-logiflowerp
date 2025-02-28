import { createRepository } from '../baseRepository'
import { UserENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi'

export const userApi = createRepository<UserENTITY, number>('user', getBaseApiLogistics('user'))

export const {
    useGetAllQuery: useGetUsersQuery,
    useGetByIdQuery: useGetUserByIdQuery,
    useCreateMutation: useCreateUserMutation,
    useUpdateMutation: useUpdateUserMutation,
    useDeleteMutation: useDeleteUserMutation,
} = userApi
