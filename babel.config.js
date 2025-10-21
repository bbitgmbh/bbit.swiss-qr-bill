const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  presets: ['@babel/typescript'],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/proposal-optional-catch-binding',
    isTest && '@babel/transform-modules-commonjs',
  ].filter(Boolean),
};
