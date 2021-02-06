module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: ['lodash', ['@babel/plugin-transform-modules-commonjs', { strictMode: false }]],
}
