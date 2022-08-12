const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

module.exports = () => {
  return {
    name: 'sonic-app',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      uniqueName: 'sonic-app',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.join(__dirname, '/src'),
      },
    },
    performance: {
      maxAssetSize: 650 * 1024,
      maxEntrypointSize: 650 * 1024,
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg/,
          type: 'asset/inline',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer'],
        process: 'process/browser',
      }),
      new EnvironmentPlugin({
        SONIC_DOCS_URL: 'https://docs.sonic.ooo',
        MAINTENANCE_MODE: '',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
    ],
  };
};
