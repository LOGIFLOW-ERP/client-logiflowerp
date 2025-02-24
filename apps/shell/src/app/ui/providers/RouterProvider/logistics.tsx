import { ErrorElement } from '@app/ui/components'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LayoutProduct = lazy(() => import('logistics/Product'))

export const childrenLogistics: RouteObject[] = [
    {
        path: 'masters',
        children: [
            {
                path: 'product',
                Component: LayoutProduct,
                errorElement: <ErrorElement />
            }
        ]
    }
]