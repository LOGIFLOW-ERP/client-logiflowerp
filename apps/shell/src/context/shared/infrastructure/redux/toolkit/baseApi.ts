import { getBaseApi } from './baseApi copy'

export const baseApi = getBaseApi(import.meta.env.VITE_API_BASE_URL_CONFIGURATION)