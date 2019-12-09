import autoExternal from 'rollup-plugin-auto-external';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import { string } from 'rollup-plugin-string';
import commonjs from 'rollup-plugin-commonjs';

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },
    // {
    //   file: 'dist/es/index.js',
    //   format: 'es',
    // },
  ],
  plugins: [
    autoExternal(),
    nodeResolve({
      extensions,
      customResolveOptions: {
        fs: './node_modules/pdfkit/js/virtual-fs.js',
      },
    }),
    commonjs({
      include: 'node_modules/**',
      extensions,
    }),
    babel({
      extensions,
    }),
    string({
      extensions,
      include: '**/*.afm',
    }),
  ],
};
