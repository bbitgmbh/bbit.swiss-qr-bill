import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    minWorkers: 0,
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      'pdfkit/js/data/Helvetica.afm': path.resolve(__dirname, 'src/__mocks__/helvetica.ts'),
      'pdfkit/js/data/Helvetica-Bold.afm': path.resolve(__dirname, 'src/__mocks__/helvetica-bold.ts'),
    },
  },
});
