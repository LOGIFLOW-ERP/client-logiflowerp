import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LayoutCurrency = lazy(() => import('@masters-configuration/currency/ui/pages/LayoutCurrency'))
const LayoutRootCompany = lazy(() => import('@masters-configuration/rootCompany/ui/pages/LayoutRootCompany'))
const LayoutCompany = lazy(() => import('@masters-configuration/company/ui/pages/LayoutCompany'))
const LayoutProfile = lazy(() => import('@masters-configuration/profile/ui/pages/LayoutProfile'))
const LayoutPersonnel = lazy(() => import('@masters-configuration/personnel/ui/pages/LayoutPersonnel'))

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
            {
                path: 'company',
                Component: LayoutCompany,
            },
            {
                path: 'profile',
                Component: LayoutProfile,
            },
            {
                path: 'personnel',
                Component: LayoutPersonnel,
            },
        ]
    },
    {
        path: 'processes',
        Component: null,
        children: []
    }
]