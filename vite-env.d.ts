/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL_CONFIGURATION: string
    readonly VITE_API_BASE_URL_LOGISTICS: string
    // más variables de entorno...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }