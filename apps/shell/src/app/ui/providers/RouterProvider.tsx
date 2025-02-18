import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorPage } from '../pages'
import { lazy } from 'react'
import { protectedLoader } from '@app/application/loaders'
import { selectAuthState } from '@shared/infrastructure/redux/auth'

const LayoutAuth = lazy(() => import('@processes/auth/ui/pages').then(mo => ({ default: mo.LayoutAuth })))
const LoginForm = lazy(() => import('@processes/auth/ui/components').then(mo => ({ default: mo.LoginForm })))

const router = createBrowserRouter([
    {
        id: 'root',
        path: '/',
        errorElement: <ErrorPage />,
        loader() {
            const { isAuthenticated } = selectAuthState()
            return { isAuthenticated }
        },
        children: [
            {
                Component: LayoutAuth,
                children: [
                    {
                        path: 'sign-in',
                        Component: LoginForm
                    }
                ]
            },
            {
                element: <>Dashboard</>,
                loader: protectedLoader,
                index: true
            }
        ]
    }
])

export function AppRouterProvider() {
    return (
        <RouterProvider router={router} />
    )
}