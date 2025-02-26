import { ErrorElement } from '@app/ui/components'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LayoutProduct = lazy(() => import('logistics/Product'))
const LayoutMovement = lazy(() => import('logistics/Movement'))

export const childrenLogistics: RouteObject[] = [
    {
        path: 'masters',
        errorElement: <ErrorElement />,
        children: [
            {
                path: 'product',
                Component: LayoutProduct,
            },
            {
                path: 'movement',
                Component: LayoutMovement,
            }
        ]
    }
]