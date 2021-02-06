module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/prettier', '@vue/typescript'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['simple-import-sort'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 'off',
    'no-unused-expressions': 'off',
    'no-undef': 'off',
    'no-shadow': 'off',
    'import/named': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': 'off',
    'import/prefer-default-export': 'off',
  },
  overrides: [
    {
      parser: '@typescript-eslint/parser',
      files: ['**/__tests__/*.{j}s?(x)', '**/tests/unit/**/*.spec.{j}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
