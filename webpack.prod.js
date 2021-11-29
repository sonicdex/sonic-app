const { EnvironmentPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
      new EnvironmentPlugin({
        NODE_ENV: 'production',
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
