import { selectAuthState } from '@shared/infrastructure/redux/auth'
import { LoaderFunctionArgs, redirect } from 'react-router-dom'

export function protectedLoader({ request }: LoaderFunctionArgs) {
    const { isAuthenticated } = selectAuthState()
    if (!isAuthenticated) {
        const params = new URLSearchParams()
        params.set('from', new URL(request.url).pathname)
        return redirect('/sign-in?' + params.toString())
    }
    return null
}