import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorPage } from '../pages'
import { lazy } from 'react'
import { protectedLoader } from '@app/application/loaders'

const LayoutAuth = lazy(() => import('@processes/auth/ui/pages').then(mo => ({ default: mo.LayoutAuth })))
const LoginForm = lazy(() => import('@processes/auth/ui/components').then(mo => ({ default: mo.LoginForm })))
const SignUpForm = lazy(() => import('@processes/auth/ui/components').then(mo => ({ default: mo.SignUpForm })))
const RequestPasswordReset = lazy(() => import('@processes/auth/ui/components').then(mo => ({ default: mo.RequestPasswordReset })))

const router = createBrowserRouter([
    {
        id: 'root',
        path: '/',
        errorElement: <ErrorPage />,
        children: [
            {
                Component: LayoutAuth,
                children: [
                    {
                        path: 'sign-in',
                        Component: LoginForm
                    },
                    {
                        path: 'sign-up',
                        Component: SignUpForm
                    },
                    {
                        path: 'request-password-reset',
                        Component: RequestPasswordReset
                    },
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
    return <RouterProvider router={router} />
}