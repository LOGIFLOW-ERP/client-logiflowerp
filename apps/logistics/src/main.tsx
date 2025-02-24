import LayoutMovement from '@masters/movement/ui/pages/LayoutMovement'
import LayoutProduct from '@masters/product/ui/pages/LayoutProduct'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <LayoutProduct /> */}
    <LayoutMovement />
  </StrictMode>,
)
