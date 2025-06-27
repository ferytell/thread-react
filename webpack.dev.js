const path = require('path');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development', // Explicitly set mode
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist') // Serve from dist in dev
    },
    open: false,
    port: 9001,
    hot: true,
    devMiddleware: {
      writeToDisk: true // Ensure files are written to disk
    },

    historyApiFallback: true
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/public/images', to: 'images' },
        { from: 'src/public/offline.html', to: 'offline.html' }
      ]
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/' // Different from production
  }
});
