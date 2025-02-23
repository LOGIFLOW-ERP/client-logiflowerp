import { lazy } from 'react'

const LayoutProfile = lazy(() => import('@masters/profile/ui/pages/LayoutProfile').then(mo => ({ default: mo.LayoutProfile })))

export const childrenConfiguration = [
    {
        path: 'masters',
        children: [
            {
                path: 'profile',
                Component: LayoutProfile,
            }
        ]
    }
]