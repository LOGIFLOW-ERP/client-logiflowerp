import { PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from './store'
import { initialState, sharedActionsActios } from './sharedSlice'

export const sharedActions = (dispatch: AppDispatch) => ({
    setState: (payload: Partial<typeof initialState>) => dispatch(sharedActionsActios.setState(payload))
})

export function setStateShared<T extends Record<string, any>>(state: T, action: PayloadAction<Partial<T>>) {
    const { payload } = action
    for (const key in payload) {
        if (Reflect.has(state, key)) {
            const value = payload[key]
            if (value !== undefined) {
                state[key] = value
            }
        } else {
            console.error(`La propiedad "${key}" no existe en el estado.`)
        }
    }
}