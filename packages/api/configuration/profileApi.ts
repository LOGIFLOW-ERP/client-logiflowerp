import { createRepository } from '../baseRepository'
import { ProfileENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi';

const schema = 'masters'
const resource = 'profile'

const path = `${schema}/${resource}`

export const profileApi = createRepository<ProfileENTITY, string>(path, getBaseApiConfiguration(path))

export const {
    useGetAllQuery: useGetProfilesQuery,
    useGetByIdQuery: useGetProfileByIdQuery,
    useCreateMutation: useCreateProfileMutation,
    useUpdateMutation: useUpdateProfileMutation,
    useDeleteMutation: useDeleteProfileMutation,
} = profileApi;
