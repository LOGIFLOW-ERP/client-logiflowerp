import { getBaseApi } from '../baseApi'

export const getBaseApiLogistics = (resource: string) => getBaseApi(import.meta.env.VITE_API_BASE_URL_CONFIGURATION, resource)