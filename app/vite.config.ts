import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import pkg from './package.json';

// https://vite.dev/config/
export default defineConfig(({ }) => {
	return {
		plugins: [
			react(),
			tsconfigPaths()
		],
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version),
		},
	}
})
