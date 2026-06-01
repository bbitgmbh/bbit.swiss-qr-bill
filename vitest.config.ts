import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'pdfkit/js/data/Helvetica.afm': fileURLToPath(new URL('./src/__mocks__/helvetica.ts', import.meta.url)),
      'pdfkit/js/data/Helvetica-Bold.afm': fileURLToPath(new URL('./src/__mocks__/helvetica-bold.ts', import.meta.url)),
    },
  },
});
