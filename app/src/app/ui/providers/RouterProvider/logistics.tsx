import { ErrorElement } from '@app/ui/components'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LayoutProductGroup = lazy(() => import('@masters-logistics/productGroup/ui/pages/LayoutProductGroup'))
const LayoutMovement = lazy(() => import('@masters-logistics/movement/ui/pages/LayoutMovement'))
const LayoutProduct = lazy(() => import('@masters-logistics/product/ui/pages/LayoutProduct'))
const LayoutProductPrice = lazy(() => import('@masters-logistics/productPrice/ui/pages/LayoutProductPrice'))
const LayoutUnitOfMeasure = lazy(() => import('@masters-logistics/unitOfMeasure/ui/pages/LayoutUnitOfMeasure'))
const LayoutStore = lazy(() => import('@masters-logistics/store/ui/pages/LayoutStore'))
const LayoutWarehouseEntry = lazy(() => import('@processes-logistics/warehouseEntry/ui/pages/LayoutWarehouseEntry'))
const LayoutWarehouseExit = lazy(() => import('@processes-logistics/warehouseExit/ui/pages/LayoutWarehouseExit'))
const LayoutWarehouseReturn = lazy(() => import('@processes-logistics/warehouseReturn/ui/pages/LayoutWarehouseReturn'))

export const childrenLogistics: RouteObject[] = [
    {
        path: 'masters',
        errorElement: <ErrorElement />,
        Component: null,
        children: [
            {
                path: 'product',
                Component: LayoutProduct,
            },
            {
                path: 'movement',
                Component: LayoutMovement,
            },
            {
                path: 'product Group',
                Component: LayoutProductGroup,
            },
            {
                path: 'product Price',
                Component: LayoutProductPrice,
            },
            {
                path: 'unit Of Measure',
                Component: LayoutUnitOfMeasure,
            },
            {
                path: 'store',
                Component: LayoutStore,
            }
        ]
    },
    {
        path: 'processes',
        errorElement: <ErrorElement />,
        Component: null,
        children: [
            {
                path: 'warehouse entry',
                Component: LayoutWarehouseEntry,
            },
            {
                path: 'warehouse exit',
                Component: LayoutWarehouseExit,
            },
            {
                path: 'warehouse return',
                Component: LayoutWarehouseReturn,
            },
        ]
    }
]