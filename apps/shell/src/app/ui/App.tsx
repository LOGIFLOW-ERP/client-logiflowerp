import { Suspense } from 'react'
import { AppRouterProvider, SnackbarProviderCustom } from './providers'
import { StoreProvider } from '@shared/ui/providers'

export function App() {
    return (
        <Suspense fallback={<>Cargando ...</>}>
            <StoreProvider>
                <SnackbarProviderCustom>
                    <AppRouterProvider />
                </SnackbarProviderCustom>
            </StoreProvider>
        </Suspense>
    )
}