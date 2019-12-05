module.exports = {
  rootDir: './',
  testRegex: '(/__tests__/.*|(\\.|/)(spec))\\.(jsx?|tsx?)$',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100,
  //   },
  // },
  reporters: ['default', 'jest-junit'],
  collectCoverage: true,
  moduleNameMapper: {
    'pdfkit/js/data/Helvetica.afm': '<rootDir>/test/__mocks__/helvetica.ts',
    'pdfkit/js/data/Helvetica-Bold.afm': '<rootDir>/test/__mocks__/helvetica-bold.ts',
  },
};
