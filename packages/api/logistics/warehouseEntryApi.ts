import { createRepository } from '../baseRepository'
import { WarehouseEntryENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';

const schema = 'processes'
const resource = 'warehouseEntry'

const path = `${schema}/${resource}`

export const warehouseEntryApi = createRepository<WarehouseEntryENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            validate: builder.mutation<void, string>({
                query: (id) => ({
                    url: `${path}/validate/${id}`,
                    method: 'PUT'
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                ],
                transformErrorResponse
            })
        })
    })

export const {
    useGetAllQuery: useGetWarehouseEntriesQuery,
    useGetByIdQuery: useGetWarehouseEntryByIdQuery,
    useCreateMutation: useCreateWarehouseEntryMutation,
    useUpdateMutation: useUpdateWarehouseEntryMutation,
    useDeleteMutation: useDeleteWarehouseEntryMutation,
    useGetPipelineQuery: useGetWarehouseEntryPipelineQuery,
    useValidateMutation: useValidateWarehouseEntryMutation
} = warehouseEntryApi;
