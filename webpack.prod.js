// const common = require('./webpack.common.js');
// const { merge } = require('webpack-merge');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

// module.exports = merge(common, {
//   mode: 'production',
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: [MiniCssExtractPlugin.loader, 'css-loader'],
//       },
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: [
//           {
//             loader: 'babel-loader',
//             options: {
//               presets: ['@babel/preset-env'],
//             },
//           },
//         ],
//       },
//     ],
//   },
//   plugins: [
//     new CleanWebpackPlugin(),
//     new MiniCssExtractPlugin(),
//     new CopyWebpackPlugin({
//       patterns: [{ from: 'src/manifest.json', to: 'manifest.json' }],
//     }),

//   ],
// });
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production', // Explicitly set mode
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/public/images', to: 'images' },
        { from: 'src/public/offline.html', to: 'offline.html' }
      ]
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/share-story/' // Add this line
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 512000,
    maxEntrypointSize: 512000
  }
});
