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


/src/modules/auth
 ├── infrastructure
 │   ├── api
 │   │   ├── authApi.ts       # Funciones para llamar a la API
 │   ├── redux
 │   │   ├── authSlice.ts     # Estado global de autenticación
 │   │   ├── authMiddleware.ts # Middleware si es necesario
 │
 ├── domain
 │   ├── entities
 │   │   ├── AuthUser.ts      # Modelo de usuario autenticado
 │   ├── repositories
 │   │   ├── authRepository.ts # Interface para repositorio de auth
 │
 ├── application
 │   ├── usecases
 │   │   ├── signUp.ts        # Caso de uso para registro
 │   │   ├── signIn.ts        # Caso de uso para login
 │   │   ├── verifyEmail.ts   # Caso de uso para verificar email
 │   │   ├── requestPasswordReset.ts # Caso de uso para pedir reset
 │   │   ├── resetPassword.ts # Caso de uso para resetear password
 │   │   ├── signOut.ts       # Caso de uso para cerrar sesión
 │   ├── state
 │   │   ├── authState.ts     # Estado reactivo si es necesario
 │
 ├── ui
 │   ├── components
 │   │   ├── LoginForm.tsx    # Formulario de login
 │   │   ├── SignUpForm.tsx   # Formulario de registro
 │   │   ├── VerifyEmail.tsx  # Componente para verificar email
 │   ├── pages
 │   │   ├── LoginPage.tsx    # Página de login
 │   │   ├── SignUpPage.tsx   # Página de registro
 │   ├── hooks
 │   │   ├── useAuth.ts       # Hook para manejar autenticación
 │   ├── providers
 │   │   ├── AuthProvider.tsx # Provider de autenticación (si usas contexto)
