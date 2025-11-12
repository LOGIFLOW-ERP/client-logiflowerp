import { createRepository } from '../baseRepository'
import { CreateOrderDetailDTO, StockSerialDTO, WarehouseEntryENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';
import { instanceToPlain } from 'class-transformer';
import { provideTagReportWarehouseStock } from './warehouseStockApi';

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
                    provideTagReportWarehouseStock
                ],
                transformErrorResponse
            }),
            addDetail: builder.mutation<WarehouseEntryENTITY, { _id: string, data: CreateOrderDetailDTO }>({
                query: ({ _id, data }) => ({
                    url: `${path}/add-detail/${_id}`,
                    method: 'PUT',
                    body: instanceToPlain(data),
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                ],
                transformErrorResponse
            }),
            addDetailBulkWarehouseEntry: builder.mutation<WarehouseEntryENTITY, { _id: string, data: Record<string, any> }>({
                query: ({ _id, data }) => ({
                    url: `${path}/add-detail-bulk/${_id}`,
                    method: 'PUT',
                    body: instanceToPlain(data),
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                ],
                transformErrorResponse
            }),
            deleteDetail: builder.mutation<WarehouseEntryENTITY, { _id: string, keyDetail: string }>({
                query: ({ _id, keyDetail }) => ({
                    url: `${path}/delete-detail/${_id}?keyDetail=${keyDetail}`,
                    method: 'PUT'
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                ],
                transformErrorResponse
            }),
            addSerial: builder.mutation<WarehouseEntryENTITY, { _id: string, keyDetail: string, data: StockSerialDTO }>({
                query: ({ _id, data, keyDetail }) => ({
                    url: `${path}/add-serial/${_id}?keyDetail=${keyDetail}`,
                    method: 'PUT',
                    body: instanceToPlain(data),
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                ],
                transformErrorResponse
            }),
            deleteSerial: builder.mutation<WarehouseEntryENTITY, { _id: string, keyDetail: string, serial: string }>({
                query: ({ _id, keyDetail, serial }) => ({
                    url: `${path}/delete-serial/${_id}?keyDetail=${keyDetail}&serial=${serial}`,
                    method: 'PUT',
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                ],
                transformErrorResponse
            }),
        })
    })

export const {
    useGetAllQuery: useGetWarehouseEntriesQuery,
    useGetByIdQuery: useGetWarehouseEntryByIdQuery,
    useCreateMutation: useCreateWarehouseEntryMutation,
    useUpdateMutation: useUpdateWarehouseEntryMutation,
    useDeleteMutation: useDeleteWarehouseEntryMutation,
    useGetPipelineQuery: useGetWarehouseEntryPipelineQuery,
    useValidateMutation: useValidateWarehouseEntryMutation,
    useAddDetailMutation: useAddDetailWarehouseEntryMutation,
    useDeleteDetailMutation: useDeleteDetailWarehouseEntryMutation,
    useAddSerialMutation: useAddSerialWarehouseEntryMutation,
    useDeleteSerialMutation: useDeleteSerialWarehouseEntryMutation,
    useAddDetailBulkWarehouseEntryMutation
} = warehouseEntryApi;
