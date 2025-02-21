import { AppDispatch } from '../store';
import { actions, initialState } from './authSlice';

export const authActions = (dispatch: AppDispatch) => ({
    setState: (payload: Partial<typeof initialState>) => dispatch(actions.setState(payload))
})