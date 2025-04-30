import { createRepository } from '../baseRepository'
import { CreateWarehouseReturnDetailDTO, StockSerialDTO, WarehouseReturnENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';
import { instanceToPlain } from 'class-transformer';

const schema = 'processes'
const resource = 'warehouseReturn'

const path = `${schema}/${resource}`

export const warehouseReturnApi = createRepository<WarehouseReturnENTITY, string>(path, getBaseApiLogistics(path))
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
            }),
            addDetail: builder.mutation<WarehouseReturnENTITY, { _id: string, data: CreateWarehouseReturnDetailDTO }>({
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
            deleteDetail: builder.mutation<WarehouseReturnENTITY, { _id: string, keyDetail: string }>({
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
            addSerial: builder.mutation<WarehouseReturnENTITY, { _id: string, keyDetail: string, data: StockSerialDTO }>({
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
            deleteSerial: builder.mutation<WarehouseReturnENTITY, { _id: string, keyDetail: string, serial: string }>({
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
    useGetAllQuery: useGetWarehouseReturnsQuery,
    useGetByIdQuery: useGetWarehouseReturnByIdQuery,
    useCreateMutation: useCreateWarehouseReturnMutation,
    useUpdateMutation: useUpdateWarehouseReturnMutation,
    useDeleteMutation: useDeleteWarehouseReturnMutation,
    useGetPipelineQuery: useGetWarehouseReturnPipelineQuery,
    useValidateMutation: useValidateWarehouseReturnMutation,
    useAddDetailMutation: useAddDetailWarehouseReturnMutation,
    useDeleteDetailMutation: useDeleteDetailWarehouseReturnMutation,
    useAddSerialMutation: useAddSerialWarehouseReturnMutation,
    useDeleteSerialMutation: useDeleteSerialWarehouseReturnMutation,
} = warehouseReturnApi;
