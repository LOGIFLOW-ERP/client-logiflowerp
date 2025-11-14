import { createRepository } from '../baseRepository'
import { NotificationENTITY } from 'logiflowerp-sdk'
import { getBaseApiConfiguration } from './baseApi';

const schema = 'masters'
const resource = 'notification'

export const pathNotificationApi = `${schema}/${resource}`

export const notificationApi = createRepository<NotificationENTITY, string>(pathNotificationApi, getBaseApiConfiguration(pathNotificationApi))

export const {
    useGetAllQuery: useGetAllNotificationsQuery,
    useUpdateMutation: useUpdateNotificationMutation,
} = notificationApi;
