import { store } from '@shared/infrastructure/redux';

export const selectAuthState = () => store.getState().auth