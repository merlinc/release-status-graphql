/* eslint-disable import/no-extraneous-dependencies, global-require */

module.exports = wallaby => ({
  files: [
    'index.js',
    'src/**/*.js?(x)',
    '!src/**/*.spec.js',
    'src/**/*.graphql',
    'mock/**/*.json',
    '!node_modules/**',
  ],
  tests: ['index.spec.js', 'src/**/*.spec.js', '!node_modules/**'],
  env: {
    type: 'node',
    runner: 'node',
    NODE_ENV: 'test',
  },

  compilers: {
    '**/*.js': wallaby.compilers.babel(),
  },

  testFramework: 'jest',
  debug: true,
});
