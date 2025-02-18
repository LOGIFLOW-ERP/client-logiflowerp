import { AppDispatch } from '@shared/infrastructure/redux';
import { actions, initialState } from './authSlice';
import { AuthUserDTO } from 'logiflowerp-sdk';

export const authActions = (dispatch: AppDispatch) => ({
    setState: (payload: Partial<typeof initialState>) => dispatch(actions.setState(payload)),
    setUser: (payload: AuthUserDTO) => dispatch(actions.setUser(payload))
})