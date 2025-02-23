import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		federation({
			name: 'logistics',
			filename: 'remoteEntry.js',
			exposes: {
				'./Product': './src/context/masters/product/ui/pages/LayoutProduct.tsx'
			},
			shared: [
				'react',
				'react-dom',
				// 'react-router-dom'
			]
		})
	],
	server: {
		port: 5174
	},
	build: {
		// modulePreload: false,
		target: 'esnext',
		minify: 'esbuild',
		cssCodeSplit: true
	}
})
