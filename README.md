microfrontends/
│── apps/                  # Microfrontends (Vite + React)
│   │── shell/             # Contenedor principal (host)
│   │── users/             # Microfrontend de usuarios
│   │── inventory/         # Microfrontend de inventario
│── packages/              # Paquetes compartidos
│   │── types/             # Tipos compartidos
│   │── ui-library/        # Componentes compartidos
│── package.json           # Configuración del monorepo
│── tsconfig.json          # Configuración TypeScript


/src
 ├── infrastructure
 │   ├── api
 │   │   ├── userApi.ts    # Funciones de API (fetch, axios)
 │   │   ├── productApi.ts
 │   ├── persistence
 │   │   ├── localStorageService.ts
 │   │   ├── indexedDBService.ts
 │   ├── redux
 │       ├── store.ts      # Configuración de Redux
 │       ├── middleware.ts # Middlewares personalizados
 │
 ├── domain
 │   ├── entities
 │   │   ├── User.ts       # Modelos de negocio
 │   │   ├── Product.ts
 │   ├── repositories
 │       ├── userRepository.ts  # Interfaces para acceso a datos
 │
 ├── application
 │   ├── usecases
 │   │   ├── fetchUsers.ts  # Casos de uso que llaman a la API
 │   │   ├── updateUser.ts
 │   ├── state
 │   │   ├── userSlice.ts   # Redux slices con estado global
 │   │   ├── productSlice.ts
 │
 ├── ui
 │   ├── components
 │   │   ├── UserCard.tsx
 │   │   ├── ProductList.tsx
 │   ├── pages
 │   │   ├── Home.tsx
 │   │   ├── Dashboard.tsx
 │   ├── hooks
 │   │   ├── useAppSelector.ts  # Hook personalizado para Redux
 │   │   ├── useAppDispatch.ts
 │   ├── providers
 │       ├── ReduxProvider.tsx  # Provider de Redux
