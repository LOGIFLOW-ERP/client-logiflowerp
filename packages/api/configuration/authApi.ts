import { baseApi } from './baseApi'
import {
    AuthUserDTO,
    CreateUserDTO,
    LoginDTO,
    RequestPasswordResetDTO,
    ResetPasswordDTO
} from 'logiflowerp-sdk'
import { instanceToPlain } from 'class-transformer'

const schema = 'processes'
const resource = 'auth'

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation<void, CreateUserDTO>({
            query: (body) => ({
                url: `/${schema}/${resource}/sign-up`,
                method: 'POST',
                body: instanceToPlain(body)
            })
        }),
        verifyEmail: builder.mutation<void, { token: string }>({
            query: (body) => ({
                url: `/${schema}/${resource}/verify-email`,
                method: 'POST',
                body,
            }),
        }),
        requestPasswordReset: builder.mutation<void, RequestPasswordResetDTO>({
            query: (body) => ({
                url: `/${schema}/${resource}/request-password-reset`,
                method: 'POST',
                body: instanceToPlain(body),
            }),
        }),
        resetPassword: builder.mutation<void, ResetPasswordDTO>({
            query: (body) => ({
                url: `/${schema}/${resource}/reset-password`,
                method: 'POST',
                body,
            }),
        }),
        signIn: builder.mutation<AuthUserDTO, LoginDTO>({
            query: (body) => ({
                url: `/${schema}/${resource}/sign-in`,
                method: 'POST',
                body: instanceToPlain(body),
            }),
            transformResponse: (res: AuthUserDTO) => {
                localStorage.setItem('authUser', JSON.stringify(res))
                return res
            }
        }),
        signOut: builder.mutation<void, void>({
            query: () => ({
                url: `/${schema}/${resource}/sign-out`,
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled
                localStorage.removeItem('authUser')
                dispatch(authApi.util.resetApiState())
            }
        })
    })
})

export const {
    useSignUpMutation,
    useVerifyEmailMutation,
    useRequestPasswordResetMutation,
    useResetPasswordMutation,
    useSignInMutation,
    useSignOutMutation,
} = authApi
