import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorPage } from '../pages'
import { lazy } from 'react'
import { protectedLoader, publicLoader } from '@app/application'

const LayoutAuth = lazy(() => import('@processes/auth/ui/pages/LayoutAuth').then(mo => ({ default: mo.LayoutAuth })))
const VerifyEmail = lazy(() => import('@processes/auth/ui/pages/VerifyEmail').then(mo => ({ default: mo.VerifyEmail })))
const ResetPassword = lazy(() => import('@processes/auth/ui/pages/ResetPassword').then(mo => ({ default: mo.ResetPassword })))
const LoginForm = lazy(() => import('@processes/auth/ui/components/LoginForm').then(mo => ({ default: mo.LoginForm })))
const SignUpForm = lazy(() => import('@processes/auth/ui/components/SignUpForm').then(mo => ({ default: mo.SignUpForm })))
const RequestPasswordResetForm = lazy(() => import('@processes/auth/ui/components/RequestPasswordResetForm').then(mo => ({ default: mo.RequestPasswordResetForm })))
const Dashboard = lazy(() => import('@shared/ui/pages/Dashboard').then(mo => ({ default: mo.Dashboard })))

const router = createBrowserRouter([
    {
        id: 'root',
        path: '/',
        errorElement: <ErrorPage />,
        children: [
            {
                loader: publicLoader,
                children: [
                    {
                        Component: LayoutAuth,
                        loader: publicLoader,
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
                ]
            },
            {
                loader: protectedLoader,
                children: [
                    {
                        Component: Dashboard,
                        index: true,
                    }
                ]
            }
        ]
    }
])

export function AppRouterProvider() {
    return <RouterProvider router={router} />
}