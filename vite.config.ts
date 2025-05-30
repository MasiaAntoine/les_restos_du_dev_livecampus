import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import type { UserConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'v8',
      exclude: [
        'node_modules/**',
        'src/components/ui/**',
        'src/vite-env.d.ts',
        'dist/**',
        'eslint.config.js',
        'vite.config.ts',
        'src/config/firebase.config.ts',
        'src/main.tsx',
      ],
    },
  },
} as UserConfig)
