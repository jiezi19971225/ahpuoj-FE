module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'entry',
        corejs: '3',
      },
    ],
  ],
  plugins: ['lodash', ['@babel/plugin-transform-modules-commonjs', { strictMode: false }]],
}
