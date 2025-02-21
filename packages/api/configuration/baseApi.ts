import { getBaseApi } from '../baseApi'

export const baseApi = getBaseApi(import.meta.env.VITE_API_BASE_URL_CONFIGURATION)