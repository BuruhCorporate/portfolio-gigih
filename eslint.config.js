import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'assets-src', 'public', '.remember', '.claude', '.playwright-mcp'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs.flat['recommended-latest']],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme', 'xxx'] }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs', 'vite.config.ts'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'error' },
  },
)
