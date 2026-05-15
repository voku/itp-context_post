import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const repositoryReference = process.env.GITHUB_REPOSITORY;
const repositoryName = repositoryReference && repositoryReference.includes('/')
  ? repositoryReference.split('/')[1]
  : undefined;
const pagesBasePath = process.env.PAGES_BASE_PATH ?? (repositoryName ? `/${repositoryName}/` : '/');

export default defineConfig(({mode}) => ({
  base: mode === 'production' ? pagesBasePath : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
