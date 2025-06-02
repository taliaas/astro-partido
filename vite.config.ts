// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true, // para usar describe, it, expect sin importar
        environment: 'jsdom', // para tests de componentes de Vue
        setupFiles: './vitest.setup.ts', // archivo para configuraciones globales (opcional)
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})
