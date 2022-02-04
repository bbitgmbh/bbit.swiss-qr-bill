const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [path.resolve('./src/index.ts')],
  devtool: 'source-map',
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
    fallback: {
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      zlib: require.resolve('browserify-zlib'),
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
    },
  },
  module: {
    rules: [
      { test: /.ts$/, use: 'babel-loader' },
      { enforce: 'post', test: /fontkit[/\\]index.js$/, use: 'transform-loader?brfs' },
      { enforce: 'post', test: /unicode-properties[/\\]index.js$/, use: 'transform-loader?brfs' },
      { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, use: 'transform-loader?brfs' },
      { test: /\.afm$/, use: 'raw-loader' },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
