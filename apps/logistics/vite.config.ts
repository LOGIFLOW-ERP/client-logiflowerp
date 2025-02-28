import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		dts({ rollupTypes: true })
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'logiflow-logistics-ui',
			fileName: 'logiflow-logistics-ui'
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDom',
					'react/jsx-runtime': 'react/jsx-runtime'
				}
			}
		}
	}
})
