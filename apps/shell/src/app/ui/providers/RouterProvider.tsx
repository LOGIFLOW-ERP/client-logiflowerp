import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorPage } from '../pages'

const router = createBrowserRouter([
    {
        id: 'root',
        path: '/',
        errorElement: <ErrorPage />
    }
])

export function AppRouterProvider() {
    return (
        <RouterProvider router={router} />
    )
}