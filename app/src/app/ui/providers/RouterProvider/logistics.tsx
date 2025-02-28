import { ErrorElement } from '@app/ui/components'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

// const LayoutMovement = lazy(() => import('../../../../../../logistics/src/context/masters/movement/ui/pages/LayoutMovement'))
const LayoutProductGroup = lazy(() => import('@masters-logistics/productGroup/ui/pages/LayoutProductGroup'))
const LayoutMovement = lazy(() => import('@masters-logistics/movement/ui/pages/LayoutMovement'))

export const childrenLogistics: RouteObject[] = [
    {
        path: 'masters',
        errorElement: <ErrorElement />,
        Component: null,
        children: [
            {
                path: 'movement',
                Component: LayoutMovement,
            },
            {
                path: 'product Group',
                Component: LayoutProductGroup,
            }
        ]
    },
    {
        path: 'processes',
        Component: null,
        children: []
    }
]