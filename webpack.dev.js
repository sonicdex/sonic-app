const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { EnvironmentPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'development',
    target: 'web',
    output: {
      filename: 'static/js/[name].js',
      chunkFilename: 'static/js/[name].js',
    },
    devtool: 'cheap-module-source-map',
    devServer: {
      hot: true,
      compress: true,
      historyApiFallback: { disableDotRule: true },
      port: 9000,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      devMiddleware: {
        index: true,
        mimeTypes: { 'text/html': ['phtml'] },
        serverSideRender: true,
        writeToDisk: true,
      },
    },
    resolve: {
      alias: {
        '@mocks': path.join(__dirname, '/mocks'),
      },
    },
    plugins: [
      new EnvironmentPlugin({
        NODE_ENV: 'development',
        HOST: 'http://localhost:9000',
        LEDGER_CANISTER_ID: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        TOKEN_CANISTER_ID: '6u36y-tyaaa-aaaah-qaawq-cai',
        SWAP_CANISTER_ID: 'goeik-taaaa-aaaah-qcduq-cai',
        WICP_CANISTER_ID: 'utozz-siaaa-aaaam-qaaxq-cai',
        XTC_CANISTER_ID: 'aanaa-xaaaa-aaaah-aaeiq-cai',
        ROSETTA_BASE_API: 'https://rosetta-api.internetcomputer.org/',
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: true,
      }),
    ],
  });
};
