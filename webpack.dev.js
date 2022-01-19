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
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: true,
      }),
    ],
  });
};
