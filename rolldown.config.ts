import { builtinModules } from 'node:module';
import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

const builtins = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]);

// Externalise every bare import (dependencies + node builtins), like the old
// rollup-plugin-auto-external. The `.afm` files are kept internal so they get
// inlined via `moduleTypes` below.
const external = (id: string) => {
  if (id.endsWith('.afm')) return false;
  if (builtins.has(id)) return true;
  return !id.startsWith('.') && !id.startsWith('/');
};

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: 'index.js',
        sourcemap: true,
      },
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: 'index.cjs',
        sourcemap: true,
      },
    ],
    platform: 'node',
    // Inline pdfkit's bundled font metrics as plain strings (matches the old
    // rollup-plugin-string behaviour).
    moduleTypes: {
      '.afm': 'text',
    },
    external,
  },
  // Bundle the type declarations into a single self-contained dist/index.d.ts
  // (no extensionless relative re-exports), so it resolves under consumers
  // using `moduleResolution: nodenext`. Run as a separate pass because the dts
  // plugin cannot emit alongside the cjs output above.
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    platform: 'node',
    plugins: [dts({ emitDtsOnly: true })],
    external,
  },
]);
