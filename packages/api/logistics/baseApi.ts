import { getBaseApi } from '../baseApi'
console.log(import.meta.env);

export const baseApi = getBaseApi(import.meta.env.VITE_API_BASE_URL_LOGISTICS)