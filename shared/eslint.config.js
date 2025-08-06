import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**/*'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // General JavaScript/TypeScript rules
      'no-console': 'warn',
      'no-unused-vars': 'off', // Use TypeScript version instead
      eqeqeq: 'error',
      semi: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      'no-magic-numbers': ['warn', { ignore: [-1, 0, 1] }],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // General JavaScript rules (no TypeScript-specific rules)
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      eqeqeq: 'error',
      semi: ['error', 'always'],

      'no-magic-numbers': ['warn', { ignore: [-1, 0, 1] }],
    },
  },
];
