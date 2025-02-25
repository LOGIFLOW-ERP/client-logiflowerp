import { Provider } from 'react-redux'
import { ReactNode } from 'react'
import { store } from '@shared/infrastructure/redux'

export function StoreProvider({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}