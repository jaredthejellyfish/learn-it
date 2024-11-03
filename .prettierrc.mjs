/** @type {import('prettier').Config} */
export default {
  printWidth: 80,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  endOfLine: 'lf',
  semi: true,
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@p/(.*)$',
    '^@c/(.*)$',
    '^@u/(.*)$',
    '^@ui/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
};
