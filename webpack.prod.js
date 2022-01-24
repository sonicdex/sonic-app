const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'production',
    devtool: 'hidden-source-map',
    target: 'browserslist',
    bail: true,
    output: {
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].js',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: { ecma: 8 },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: { safari10: true },
            keep_classnames: true,
            keep_fnames: true,
            output: { ecma: 5, comments: false, ascii_only: true },
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: {
            test: /[\\/].yarn[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
    plugins: [
      new EnvironmentPlugin({
        NODE_ENV: 'production',
        HOST: 'http://localhost:9000',
        LEDGER_CANISTER_ID: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        SWAP_CANISTER_ID: '3xwpq-ziaaa-aaaah-qcn4a-cai',
        WICP_CANISTER_ID: 'utozz-siaaa-aaaam-qaaxq-cai',
        XTC_CANISTER_ID: 'aanaa-xaaaa-aaaah-aaeiq-cai',
        WICP_ACCOUNT_ID:
          'cc659fe529756bae6f72db9937c6c60cf7ad57eb4ac5f930a75748927aab469a',
        XTC_ACCOUNT_ID:
          '758bdb7e54b73605d1d743da9f3aad70637d4cddcba03db13137eaf35f12d375',
        SWAP_CAP_ROOT_CANISTER_ID: '3qxje-uqaaa-aaaah-qcn4q-cai',
        CYCLES_MINTING_CANISTER_ID: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
        ROSETTA_BASE_API: 'https://rosetta-api.internetcomputer.org/',
        IS_DARK_MODE_ENABLED: 'false',
      }),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    ],
  });
};
