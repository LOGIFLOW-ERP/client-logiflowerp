import { useStore } from '@shared/ui/hooks'

export function LoginForm() {
    const { actions: { setState } } = useStore('shared')
    return (
        <button onClick={() => setState({ prueba: 'Hola' })}>LoginForm</button>
    )
}
