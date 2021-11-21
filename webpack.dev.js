const path = require('path');
const webpack = require('webpack');
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
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        HOST: 'http://localhost:9000',
      }),
    ],
  });
};
