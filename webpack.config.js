/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [path.resolve('./src/index.ts')],
  devtool: 'sourcemap',
  target: 'web',
  output: {
    path: path.resolve('./dist/es'),
    filename: 'index.js',
    library: 'swiss-qr-bill',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve('./src'), 'node_modules'],
    alias: {
      fs: 'pdfkit/js/virtual-fs.js',
    },
  },
  module: {
    rules: [
      { test: /.ts$/, use: 'babel-loader' },
      { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: 'transform-loader?brfs' },
      { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: 'transform-loader?brfs' },
      { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: 'transform-loader?brfs' },
      { test: /\.afm$/, loader: 'raw-loader' },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
