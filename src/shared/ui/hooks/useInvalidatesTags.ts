import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { InvalidatesTagsDTO } from 'logiflowerp-sdk'
import { warehouseEntryApi } from '@shared/infrastructure/redux/api'

export function useInvalidatesTags() {
    const dispatch = useDispatch()

    const mapApi = {
        warehouseEntryApi,
    } as const

    return useCallback((tags: InvalidatesTagsDTO[]) => {
        if (!tags || tags.length === 0) return

        const grouped = new Map<string, InvalidatesTagsDTO[]>()

        for (const t of tags) {
            if (!grouped.has(t.api)) grouped.set(t.api, [])
            grouped.get(t.api)!.push(t)
        }

        for (const [apiName, tagsForApi] of grouped.entries()) {
            const api = mapApi[apiName as keyof typeof mapApi]

            if (!api) {
                console.warn(`API desconocida: ${apiName}`)
                continue
            }

            dispatch(api.util.invalidateTags(tagsForApi))
        }
    }, [])
}
