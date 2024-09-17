import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/client',
    resolve: {
        alias: {
            '@root': path.resolve(__dirname, 'src'),
        },
    },
    preview: {
        host: true,
        port: 3029
    },
});
