// eslint.config.cjs
const eslintPluginAstro = require('eslint-plugin-astro')
const astroParser = require('astro-eslint-parser')
const tsParser = require('@typescript-eslint/parser')
const reactPlugin = require('eslint-plugin-react')
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y')

module.exports = [
  // Include the recommended config from eslint-plugin-astro
  ...eslintPluginAstro.configs['flat/all'],

  // Astro files configuration
  {
    files: ['**/*.astro'],
    plugins: {
      astro: eslintPluginAstro,
    },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser, // Parser for embedded scripts
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Astro-specific rules
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/no-conflict-set-directives': 'error',
      'astro/valid-compile': 'error',
    },
  },

  // Client-side scripts within Astro files
  {
    files: ['**/*.astro/*.ts', '**/*.astro/*.tsx'],
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // Specify your tsconfig file if needed
      },
    },
    rules: {
      // TypeScript and React rules
      'no-unused-vars': 'off', // Turn off base rule
      '@typescript-eslint/no-unused-vars': ['error'],
      'react/jsx-uses-react': 'off', // React 17+ doesn't require React in scope
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off', // If not using PropTypes
    },
  },

  // TypeScript React (.tsx) files
  {
    files: ['**/*.tsx'],
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // Ensure this points to your tsconfig
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',

      // Accessibility (A11Y) rules
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      // Add more A11Y rules as needed
    },
  },
]
