import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        include: [
            '03-reading-support/test/**/*.test.{ts,tsx}',
            '02-accessibility-ui/test/**/*.test.{ts,tsx}',
            '05-analytics-engine/test/**/*.test.{ts,tsx}',
            'backend/tests/**/*.test.{js,ts}'
        ],
        setupFiles: ['./vitest.setup.jsx'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
