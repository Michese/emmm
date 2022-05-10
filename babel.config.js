module.exports = {
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        targets: {
          browsers: ['edge >= 16', 'safari >= 9', 'firefox >= 57', 'ie >= 11', 'ios >= 9', 'chrome >= 49'],
        },
      },
    ],
  ],
};
