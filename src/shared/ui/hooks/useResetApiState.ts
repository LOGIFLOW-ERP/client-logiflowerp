import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
    employeeStockApi,
    warehouseEntryApi,
    warehouseExitApi,
    warehouseStockApi
} from '@shared/infrastructure/redux/api'

export function useResetApiState() {
    const dispatch = useDispatch()

    const mapApi = {
        warehouseEntryApi,
        warehouseExitApi,
        employeeStockApi,
        warehouseStockApi,
    } as const

    return useCallback((tags: (keyof typeof mapApi)[]) => {
        for (const apiName of tags) {
            const api = mapApi[apiName as keyof typeof mapApi]

            if (!api) {
                console.warn(`API desconocida: ${apiName}`)
                continue
            }

            console.log('Resetting API state for:', apiName)

            dispatch(api.util.resetApiState())
        }
    }, [])
}
