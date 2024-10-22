/// <reference types="vitest" />

import { defineConfig, Plugin } from 'vite';
import analog from '@analogjs/platform';
// @ts-expect-error private API
import { augmentAppWithServiceWorker } from '@angular/build/private';
import * as path from 'node:path';

function swBuildPlugin(ssr: boolean | undefined): Plugin {
  return {
    name: 'analog-sw',
    async closeBundle() {
      if (!ssr) {
        console.log('Building service worker');
        await augmentAppWithServiceWorker(
          '.',
          process.cwd(),
          path.join(process.cwd(), 'dist/client'),
          '/',
        );
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog(),
    swBuildPlugin(isSsrBuild)
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
