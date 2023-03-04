// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'typescript/no-var-requires': 'off',
      },
    },
  ],
})