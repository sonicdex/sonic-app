const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
      }),
    ],
  });
};
