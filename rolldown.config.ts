import { builtinModules } from 'node:module';
import { defineConfig } from 'rolldown';

const builtins = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]);

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'index.js',
    sourcemap: true,
  },
  platform: 'node',
  // Inline pdfkit's bundled font metrics as plain strings (matches the old
  // rollup-plugin-string behaviour).
  moduleTypes: {
    '.afm': 'text',
  },
  // Externalise every bare import (dependencies + node builtins), like the old
  // rollup-plugin-auto-external. The `.afm` files are kept internal so they get
  // inlined via `moduleTypes` above.
  external: (id) => {
    if (id.endsWith('.afm')) return false;
    if (builtins.has(id)) return true;
    return !id.startsWith('.') && !id.startsWith('/');
  },
});
