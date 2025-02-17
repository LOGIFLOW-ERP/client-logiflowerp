import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
    {
        element: <>H63a</>,
        path: '/'
    }
])

export function AppRouterProvider() {
    return (
        <RouterProvider router={router} />
    )
}