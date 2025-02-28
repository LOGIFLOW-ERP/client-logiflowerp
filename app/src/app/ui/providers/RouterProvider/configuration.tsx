import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LayoutProfile = lazy(() => import('@masters/profile/ui/pages/LayoutProfile').then(mo => ({ default: mo.LayoutProfile })))

export const childrenConfiguration: RouteObject[] = [
    {
        path: 'masters',
        Component: null,
        children: [
            {
                path: 'profile',
                Component: LayoutProfile,
            }
        ]
    },
    {
        path: 'processes',
        Component: null,
        children: []
    }
]