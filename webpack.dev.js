const path = require('path');
const { merge } = require('webpack-merge');
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
    // client: {
    //   overlay: {
    //     errors: true,
    //     warnings: true
    //   }
    // },
    devMiddleware: {
      writeToDisk: true // Ensure files are written to disk
    },

    historyApiFallback: true
  },
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
