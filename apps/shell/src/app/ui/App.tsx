import { Suspense } from 'react'
import { AppRouterProvider } from './providers'
import { StoreProvider } from '@shared/ui/providers'

export function App() {
    return (
        <Suspense fallback={<>Cargando ...</>}>
            <StoreProvider>
                <AppRouterProvider />
            </StoreProvider>
        </Suspense>
    )
}