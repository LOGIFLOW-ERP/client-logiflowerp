import { PayloadAction } from '@reduxjs/toolkit'
// import { AppDispatch } from './store'

// export const sharedActions = <T>(dispatch: AppDispatch) => ({
//     setState: (payload: Partial<T>) => dispatch(actions.setState(payload))
// })

export function setStateShared<T extends Record<string, any>>(state: T, action: PayloadAction<Partial<T>>) {
    const { payload } = action
    for (const key in payload) {
        if (Reflect.has(state, key)) {
            const value = payload[key]
            if (value !== undefined) {
                state[key] = value
            } else {
                console.error(`No se puede asignar undefined a la propiedad "${key}".`)
            }
        } else {
            console.error(`La propiedad "${key}" no existe en el estado.`)
        }
    }
}