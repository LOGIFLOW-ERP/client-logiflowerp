/// <reference types='vite/client' />

declare module 'logistics/Product' {
    import { ReactNode } from 'react'
    export default React.FC<{ children?: ReactNode }>
}
declare module 'logistics/Movement' {
    import { ReactNode } from 'react'
    export default React.FC<{ children?: ReactNode }>
}
