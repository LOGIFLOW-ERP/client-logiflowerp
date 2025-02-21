import { selectAuthState } from '@shared/infrastructure/redux/auth'
import { redirect } from 'react-router-dom'

export function publicLoader() {
    const { isAuthenticated } = selectAuthState()
    if (isAuthenticated) {
        return redirect('/')
    }
    return null
}