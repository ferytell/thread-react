const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/manifest.json', to: 'manifest.json' }]
    })
  ]
});
// const path = require('path');
// const { merge } = require('webpack-merge');
// const common = require('./webpack.common.js');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { InjectManifest } = require('workbox-webpack-plugin');

// const isGithubPages = process.env.GITHUB_PAGES === 'true';

// module.exports = merge(common, {
//   mode: 'production', // Explicitly set mode
//   devtool: 'source-map',
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: [MiniCssExtractPlugin.loader, 'css-loader']
//       },
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       }
//     ]
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: '[name].[contenthash].css'
//     }),
//     new CopyWebpackPlugin({
//       patterns: [
//         { from: 'src/manifest.json', to: 'manifest.json' },
//         { from: 'src/public/images', to: 'images' },
//         { from: 'src/public/offline.html', to: 'offline.html' }
//       ]
//     }),
//     new InjectManifest({
//       swSrc: path.resolve(__dirname, 'src/public/sw.js'),
//       swDest: 'sw.js',
//       additionalManifestEntries: [
//         { url: '/offline.html', revision: '123' },
//         { url: '/images/ShareStoryIcon.png', revision: '456' }
//       ],
//       exclude: [/\.map$/, /manifest\.json$/, /_redirects/, /DS_Store/]
//     }),
//     new HtmlWebpackPlugin({
//       template: './src/index.html',
//       filename: 'index.html',
//       publicPath: isGithubPages ? '/share-story/' : '/'
//     })
//   ],
//   output: {
//     filename: '[name].[contenthash].js',
//     path: path.resolve(__dirname, 'dist'),
//     publicPath: isGithubPages ? '/share-story/' : '/'
//   },
//   performance: {
//     hints: 'warning',
//     maxAssetSize: 512000,
//     maxEntrypointSize: 512000
//   }
// });
