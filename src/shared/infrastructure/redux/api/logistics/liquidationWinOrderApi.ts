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
            })
        })
    })

export const {
    useGetAllQuery: useGetLiquidationWINOrdersQuery,
    useAddInventoryMutation: useAddInventoryWINOrderMutation,
} = liquidationWinOrderApi;
