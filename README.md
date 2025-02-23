# Client Logiflow ERP

## 🚀 Instalar dependencias (En la raíz del proyecto)
npm i

## 🚀 Instalar una dependencia en todo el monorepo (globalmente) (instálala en la raíz)
npm install nombre-paquete

## 🚀 Instalar una dependencia solo en un microfrontend específico (instálala en la raíz)
npm install nombre-paquete --workspace=apps/shell

## 🚀 Instalar una dependencia en múltiples microfrontends (instálala en la raíz)
npm install nombre-paquete --workspaces

## ✅ Iniciar solo el host:
npm run dev:host

## ✅ Iniciar solo el remoto (logistics):
npm run dev:remote

## ✅ Iniciar ambos (host + remoto):
npm run dev:all

## ✅ Construir todo:
npm run build

## ✅ Servir en modo producción:
npm run serve

✅ Detener puertos ocupados:
npm run stop
