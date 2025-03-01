import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LayoutCurrency = lazy(() => import('@masters-configuration/currency/ui/pages/LayoutCurrency'))

export const childrenConfiguration: RouteObject[] = [
    {
        path: 'masters',
        Component: null,
        children: [
            {
                path: 'currency',
                Component: LayoutCurrency,
            }
        ]
    },
    {
        path: 'processes',
        Component: null,
        children: []
    }
]