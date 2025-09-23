import { createRepository } from '../baseRepository'
import { CreateWarehouseExitDetailDTO, StockSerialDTO, WarehouseExitENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';
import { instanceToPlain } from 'class-transformer';
import { provideTagReportEmployeeStock } from './employeeStockApi';
import { provideTagReportWarehouseStock } from './warehouseStockApi';

const schema = 'processes'
const resource = 'warehouseExit'

const path = `${schema}/${resource}`

export const warehouseExitApi = createRepository<WarehouseExitENTITY, string>(path, getBaseApiLogistics(path))
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
                    provideTagReportEmployeeStock,
                    provideTagReportWarehouseStock,
                ],
                transformErrorResponse
            }),
            addDetail: builder.mutation<WarehouseExitENTITY, { _id: string, data: CreateWarehouseExitDetailDTO }>({
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
            deleteDetail: builder.mutation<WarehouseExitENTITY, { _id: string, keyDetail: string }>({
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
            addSerial: builder.mutation<WarehouseExitENTITY, { _id: string, keyDetail: string, data: StockSerialDTO }>({
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
            deleteSerial: builder.mutation<WarehouseExitENTITY, { _id: string, keyDetail: string, serial: string }>({
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
    useGetAllQuery: useGetWarehouseExitsQuery,
    useGetByIdQuery: useGetWarehouseExitByIdQuery,
    useCreateMutation: useCreateWarehouseExitMutation,
    useUpdateMutation: useUpdateWarehouseExitMutation,
    useDeleteMutation: useDeleteWarehouseExitMutation,
    useGetPipelineQuery: useGetWarehouseExitPipelineQuery,
    useValidateMutation: useValidateWarehouseExitMutation,
    useAddDetailMutation: useAddDetailWarehouseExitMutation,
    useDeleteDetailMutation: useDeleteDetailWarehouseExitMutation,
    useAddSerialMutation: useAddSerialWarehouseExitMutation,
    useDeleteSerialMutation: useDeleteSerialWarehouseExitMutation,
} = warehouseExitApi;
