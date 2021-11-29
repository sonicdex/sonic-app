const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      hot: true,
      historyApiFallback: true,
      port: 9000,
      compress: true,
      static: {
        directory: path.join(__dirname, 'public'),
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
        SWAP_STORAGE_CANISTER_ID: 'ghhdw-fiaaa-aaaah-qcdva-cai',
        WICP_CANISTER_ID: 'gagfc-iqaaa-aaaah-qcdvq-cai',
        XTC_CANISTER_ID: 'gvbup-jyaaa-aaaah-qcdwa-cai',
        ROSETTA_BASE_API: 'https://rosetta-api.internetcomputer.org/',
      }),
    ],
  });
};
