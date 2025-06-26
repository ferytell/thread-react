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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/manifest.json', to: 'manifest.json' }],
    }),

    // new WorkboxPlugin.GenerateSW({
    //   clientsClaim: true,
    //   skipWaiting: true,
    //   runtimeCaching: [
    //     {
    //       // Asset
    //       urlPattern: /\.(?:js|css|html|png|jpg|jpeg|svg|woff2?)$/,
    //       handler: 'CacheFirst',
    //       options: {
    //         cacheName: 'assets-cache',
    //         expiration: {
    //           maxEntries: 60,
    //           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
    //         },
    //       },
    //     },
    //     {
    //       // API call to /stories
    //       urlPattern: ({ url }) => url.pathname.includes('/stories'),
    //       handler: 'NetworkFirst',
    //       options: {
    //         cacheName: 'stories-api-cache',
    //         networkTimeoutSeconds: 3,
    //         expiration: {
    //           maxEntries: 100,
    //           maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
    //         },
    //         cacheableResponse: {
    //           statuses: [0, 200],
    //         },
    //       },
    //     },
    //     {
    //       urlPattern: /^https:\/\/(.*)\.tile\.openstreetmap\.org\/.*/,
    //       handler: 'CacheFirst',
    //       options: {
    //         cacheName: 'osm-tiles-cache',
    //         expiration: {
    //           maxEntries: 100,
    //           maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
    //         },
    //         cacheableResponse: {
    //           statuses: [0, 200],
    //         },
    //       },
    //     },
    //   ],
    // }),
  ],
});
