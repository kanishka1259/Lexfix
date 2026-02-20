import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './frontend/src'),
            // Force a single copy of React/ReactDOM to avoid the duplicate instance error
            'react': path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
            'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/**/*.test.{js,jsx,ts,tsx}'],
        setupFiles: ['./tests/setup.js'],
        css: false,
    },
});
