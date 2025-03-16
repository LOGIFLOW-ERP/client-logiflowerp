import { getBaseApi } from '../baseApi'

export const getBaseApiConfiguration = (resource: string) => getBaseApi(import.meta.env.VITE_API_BASE_URL_CONFIGURATION, resource)