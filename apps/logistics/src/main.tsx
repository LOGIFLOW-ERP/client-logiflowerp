import "reflect-metadata/lite"
import LayoutMovement from '@masters/movement/ui/pages/LayoutMovement'
// import LayoutProduct from '@masters/product/ui/pages/LayoutProduct'
import { StoreProvider } from '@shared/ui/providers'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    {/* <LayoutProduct /> */}
    <LayoutMovement />
  </StoreProvider>,
)
