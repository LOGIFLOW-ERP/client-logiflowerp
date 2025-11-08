import { createRepository } from '../baseRepository'
import { UserENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi'

const schema = 'masters'
const resource = 'rootuser'

const path = `${schema}/${resource}`

export const rootUserApi = createRepository<UserENTITY, string>(path, getBaseApiConfiguration(path))

export const {
    useGetAllQuery: useGetUsersQuery,
    useGetByIdQuery: useGetUserByIdQuery,
    useCreateMutation: useCreateUserMutation,
    useUpdateMutation: useUpdateUserMutation,
    useDeleteMutation: useDeleteUserMutation,
    useLazyGetByIdQuery: useLazyGetUserByIdQuery,
} = rootUserApi
