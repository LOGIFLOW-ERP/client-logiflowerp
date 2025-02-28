import { Suspense } from 'react'
import { AppRouterProvider, SnackbarProviderCustom } from './providers'
import { StoreProvider } from '@shared/ui/providers'
import { Fallback } from './pages'

export function App() {
    return (
        <Suspense fallback={<Fallback/>}>
            <StoreProvider>
                <SnackbarProviderCustom>
                    <AppRouterProvider />
                </SnackbarProviderCustom>
            </StoreProvider>
        </Suspense>
    )
}