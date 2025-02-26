import { createRepository } from './baseRepository'
import { UserENTITY } from 'logiflowerp-sdk'
import { baseApi } from './baseApi'

export const userApi = createRepository<UserENTITY, number>('user', baseApi)

export const {
    useGetAllQuery: useGetUsersQuery,
    useGetByIdQuery: useGetUserByIdQuery,
    useCreateMutation: useCreateUserMutation,
    useUpdateMutation: useUpdateUserMutation,
    useDeleteMutation: useDeleteUserMutation,
} = userApi
