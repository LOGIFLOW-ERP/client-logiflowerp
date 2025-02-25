import { AppDispatch, RootState } from '@shared/infrastructure/redux'
import { sharedActions } from '@shared/infrastructure/redux/actions'
import { useDispatch, useSelector } from 'react-redux'

const actionCreators = {
    shared: sharedActions,
} as const

export function useStore<T extends keyof typeof actionCreators>(sliceName: T) {

    const state = useSelector((state: RootState) => state[sliceName])
    const dispatch = useDispatch<AppDispatch>()

    const actions = actionCreators[sliceName]?.(dispatch) ?? {}

    return {
        state,
        actions
    }

}