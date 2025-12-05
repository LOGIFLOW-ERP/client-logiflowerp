import { createRepository } from '../baseRepository'
import {
    BodyReqReportProductionWinDTO,
    DataWinReportProduction,
    DataWinReportProductionZonas,
    WINOrderENTITY
} from 'logiflowerp-sdk'
import { getBaseApiLogistics } from './baseApi';
import { transformErrorResponse } from '../transformErrorResponse';
import { instanceToPlain } from 'class-transformer';
const schema = 'reports'
const resource = 'winReports'

const path = `${schema}/${resource}`

export const winReportsApi = createRepository<WINOrderENTITY, string>(path, getBaseApiLogistics(path))
    .injectEndpoints({
        endpoints: (builder) => ({
            production: builder.query<DataWinReportProduction[], BodyReqReportProductionWinDTO>({
                query: (body) => ({
                    url: `${path}/production`,
                    method: 'POST',
                    body: instanceToPlain(body)
                }),
                transformErrorResponse
            }),
            productionZones: builder.query<DataWinReportProductionZonas[], BodyReqReportProductionWinDTO>({
                query: (body) => ({
                    url: `${path}/production-zones`,
                    method: 'POST',
                    body: instanceToPlain(body)
                }),
                transformErrorResponse
            }),
        })
    })

export const {
    useProductionQuery: useProductionWinReportsQuery,
    useProductionZonesQuery: useProductionZonesWinReportsQuery
} = winReportsApi
