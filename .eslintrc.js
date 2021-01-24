module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/prettier', '@vue/typescript'],
  parserOptions: {
    parser: 'babel-eslint',
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
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
