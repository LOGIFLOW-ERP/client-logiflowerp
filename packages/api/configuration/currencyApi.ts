import { createRepository } from '../baseRepository'
import { CurrencyENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';

const schema = 'masters'
const resource = 'currency'

const path = `${schema}/${resource}`

export const currencyApi = createRepository<CurrencyENTITY, number>(path, getBaseApiLogistics(path))

export const {
    useGetAllQuery: useGetCurrenciesQuery,
    useGetByIdQuery: useGetCurrencyByIdQuery,
    useCreateMutation: useCreateCurrencyMutation,
    useUpdateMutation: useUpdateCurrencyMutation,
    useDeleteMutation: useDeleteCurrencyMutation,
} = currencyApi;
