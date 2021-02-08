module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: [
    'lodash',
    ['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es' }],
    ['@babel/plugin-transform-modules-commonjs', { strictMode: false }],
  ],
}
