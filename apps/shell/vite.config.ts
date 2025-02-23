import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), 'VITE_')
	return {
		plugins: [
			react(),
			tsconfigPaths(),
			federation({
				remotes: {
					logistics: `${env.VITE_REMOTE_LOGISTICS_URL}/assets/remoteEntry.js`
				},
				shared: [
					'react',
					'react-dom'
				]
			})
		],
		build: {
			modulePreload: false,
			target: 'esnext',
			minify: false,
			cssCodeSplit: false
		}
	}
})
