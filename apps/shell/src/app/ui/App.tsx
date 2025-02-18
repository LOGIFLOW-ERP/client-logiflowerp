import { Suspense } from 'react'
import { AppRouterProvider } from './providers'
import { StoreProvider } from '@processes/auth/ui/providers'

export function App() {
    return (
        <Suspense fallback={<>Error</>}>
            <StoreProvider>
                <AppRouterProvider />
            </StoreProvider>
        </Suspense>
    )
}