import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorPage } from '../pages'
import { lazy } from 'react'
import { protectedLoader } from '@app/application/loaders'

const LayoutAuth = lazy(() => import('@processes/auth/ui/pages').then(mo => ({ default: mo.LayoutAuth })))
const VerifyEmail = lazy(() => import('@processes/auth/ui/pages').then(mo => ({ default: mo.VerifyEmail })))
const ResetPassword = lazy(() => import('@processes/auth/ui/pages').then(mo => ({ default: mo.ResetPassword })))
const LoginForm = lazy(() => import('@processes/auth/ui/components').then(mo => ({ default: mo.LoginForm })))
const SignUpForm = lazy(() => import('@processes/auth/ui/components').then(mo => ({ default: mo.SignUpForm })))
const RequestPasswordResetForm = lazy(() => import('@processes/auth/ui/components').then(mo => ({ default: mo.RequestPasswordResetForm })))

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
                        Component: RequestPasswordResetForm
                    },
                ]
            },
            {
                path: 'verify-email',
                Component: VerifyEmail
            },
            {
                path: 'reset-password',
                Component: ResetPassword
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