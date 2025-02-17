import { Suspense } from 'react';
import { AppRouterProvider } from './providers';

export function App() {
    return (
        <Suspense fallback={<>Error</>}>
            <AppRouterProvider />
        </Suspense>
    )
}