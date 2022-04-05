// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('vue-html-webpack-plugin');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  publicPath: '.',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  css: { extract: process.env.NODE_ENV !== 'production' },
  configureWebpack: {
    optimization: {
      splitChunks: false,
      minimize: process.env.NODE_ENV === 'production',
    },
    plugins: [
      new HtmlWebpackPlugin({
        vue: true,
        inlineSource: '.(js|css)$',
        inject: 'body',
        minify: {
          html5: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: false,
          removeAttributeQuotes: true,
          removeComments: true, // false for Vue SSR to find app placeholder
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributese: true,
          useShortDoctype: true,
        },
      }),
      new HtmlWebpackInlineSourcePlugin(),
    ],
  },
};
