import { ErrorElement } from '@app/ui/components'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
// import WebComponentPage from '../../../../../../logistics/src/context/masters/movement/ui/pages/LayoutMovement'

const LayoutProduct = lazy(() => import('logistics/Product'))
const LayoutMovement = lazy(() => import('../../../../../../logistics/src/context/masters/movement/ui/pages/LayoutMovement'))

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