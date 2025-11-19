import { createRepository } from '../baseRepository'
import { CreateInventoryDTO, WINOrderENTITY } from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';
import { instanceToPlain } from 'class-transformer';
import { provideTagGetDataLiquidationOrderEmployeeStock } from './employeeStockApi';

const schema = 'processes'
const resource = 'Liquidationwinorder'

const path = `${schema}/${resource}`

export const liquidationWinOrderApi = createRepository<WINOrderENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            addInventory: builder.mutation<void, { _id: string, data: CreateInventoryDTO }>({
                query: ({ _id, data }) => ({
                    url: `${path}/add-inventory/${_id}`,
                    method: 'PUT',
                    body: instanceToPlain(data),
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                    provideTagGetDataLiquidationOrderEmployeeStock
                ],
                transformErrorResponse
            }),
            sendReview: builder.mutation<void, string>({
                query: (_id) => ({
                    url: `${path}/send-review/${_id}`,
                    method: 'PUT',
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                    provideTagGetDataLiquidationOrderEmployeeStock
                ],
                transformErrorResponse
            }),
            deleteFile: builder.mutation<void, { _id: string, key: string }>({
                query: ({ _id, key }) => ({
                    url: `${path}/delete-photos/${_id}`,
                    method: 'PUT',
                    body: instanceToPlain({ key })
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` },
                ],
                transformErrorResponse
            }),
            uploadFile: builder.mutation<WINOrderENTITY, { _id: string, formData: FormData }>({
                query: ({ formData, _id }) => ({
                    url: `${path}/upload-photos/${_id}`,
                    method: 'POST',
                    body: formData,
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` }
                ],
                transformErrorResponse
            }),
            finalizeOrder: builder.mutation<void, string>({
                query: (_id) => ({
                    url: `${path}/finalize-order/${_id}`,
                    method: 'PUT',
                }),
                invalidatesTags: [
                    { type: path, id: `LIST${path}` },
                    { type: path, id: `LIST1${path}` },
                    { type: path, id: `STATIC_PIPELINE${path}` },
                    { type: path, id: `PIPELINE${path}` }
                ],
                transformErrorResponse
            })
        })
    })

export const {
    useGetAllQuery: useGetLiquidationWINOrdersQuery,
    useAddInventoryMutation: useAddInventoryWINOrderMutation,
    useUploadFileMutation: useUploadFileWINOrderMutation,
    useDeleteFileMutation: useDeleteFileWINOrderMutation,
    useSendReviewMutation: useSendReviewWINOrderMutation,
    useFinalizeOrderMutation: useFinalizeLiquidationWINOrderMutation
} = liquidationWinOrderApi;
