import { ErrorElement } from '@app/ui/components'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LayoutMovement = lazy(() => import('../../../../../../logistics/src/context/masters/movement/ui/pages/LayoutMovement'))

export const childrenLogistics: RouteObject[] = [
    {
        path: 'masters',
        errorElement: <ErrorElement />,
        Component: null,
        children: [
            {
                path: 'movement',
                Component: LayoutMovement,
            }
        ]
    },
    {
        path: 'processes',
        Component: null,
        children: []
    }
]