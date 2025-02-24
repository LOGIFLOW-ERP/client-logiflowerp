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
                // element: <div>H63a</div>,
                Component: LayoutProduct,
                errorElement: <ErrorElement />
            }
        ]
    }
]