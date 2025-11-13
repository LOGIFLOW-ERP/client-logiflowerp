import { Suspense } from 'react'
import { AppRouterProvider, SnackbarProviderCustom } from './providers'
import { StoreProvider } from '@shared/ui/providers'
import { Fallback } from './pages'
import { SocketProvider } from '@shared/infrastructure/socket/SocketContext'

export function App() {
    return (
        <Suspense fallback={<Fallback />}>
            <SocketProvider>
                <StoreProvider>
                    <SnackbarProviderCustom>
                        <AppRouterProvider />
                    </SnackbarProviderCustom>
                </StoreProvider>
            </SocketProvider>
        </Suspense>
    )
}