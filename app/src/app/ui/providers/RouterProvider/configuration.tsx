import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LayoutCurrency = lazy(() => import('@masters-configuration/currency/ui/pages/LayoutCurrency'))
const LayoutRootCompany = lazy(() => import('@masters-configuration/rootCompany/ui/pages/LayoutRootCompany'))

export const childrenConfiguration: RouteObject[] = [
    {
        path: 'masters',
        Component: null,
        children: [
            {
                path: 'currency',
                Component: LayoutCurrency,
            },
            {
                path: 'root company',
                Component: LayoutRootCompany,
            },
        ]
    },
    {
        path: 'processes',
        Component: null,
        children: []
    }
]