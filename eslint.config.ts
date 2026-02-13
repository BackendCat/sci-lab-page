import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['eslint.config.ts', 'vite.config.ts', 'prettier.config.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'simple-import-sort': simpleImportSort,
      prettier,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'prettier/prettier': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:', `^(${(await import('node:module')).builtinModules.join('|')})(/|$)`],
            ['^@nestjs', '^@?\\w'],
            ['^(@|src|@app|@shared|@prisma|@prisma-gen|@common)(/.*|$)'],
            ['^.+\\.s?css$'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true, allowNullish: true },
      ],
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-invalid-void-type': 'warn',
      '@typescript-eslint/no-misused-spread': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: true }],
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',

      complexity: ['error', 20],
      'max-depth': ['error', 5],
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
      'max-nested-callbacks': ['error', 3],
      'max-params': ['error', 6],
      'max-statements': ['error', 40],
      'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],

      curly: ['error', 'multi-line', 'consistent'],
      eqeqeq: ['error', 'always'],
      'no-else-return': ['error', { allowElseIf: false }],
      'no-fallthrough': 'error',
      'no-implicit-coercion': 'error',
      'no-magic-numbers': [
        'warn',
        { ignore: [0, 1, -1], ignoreDefaultValues: true, enforceConst: true },
      ],
      'no-return-await': 'error',
      'no-unreachable': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },
]);
