// const path = require('path');
// const common = require('./webpack.common.js');
// const { merge } = require('webpack-merge');

// module.exports = merge(common, {
//   mode: 'development',
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
//   devServer: {
//     static: path.resolve(__dirname, 'src'),
//     open: false,
//     port: 9001,
//     client: {
//       overlay: {
//         errors: true,
//         warnings: true,
//       },
//     },
//   },
// });
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development', // Explicitly set mode
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // Serve from dist in dev
    },
    open: false,
    port: 9001,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});
