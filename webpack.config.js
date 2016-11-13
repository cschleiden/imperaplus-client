'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const loaders = require('./webpack/loaders');
const styleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const baseAppEntries = [
  './src/index.tsx',
];

const devAppEntries = [
  //'webpack-hot-middleware/client?reload=true',
];

const appEntries = baseAppEntries
  .concat(process.env.NODE_ENV === 'development' ? devAppEntries : []);

const sourceMap = process.env.TEST || process.env.NODE_ENV !== 'production'
  ? [new webpack.SourceMapDevToolPlugin({ filename: null, test: /\.tsx?$/ })]
  : [];

const basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[hash].js'),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    inject: 'body',
  }),
  new ProgressBarPlugin(),
  new CopyWebpackPlugin([
    { from: './src/assets', to: './assets' },
    { from: './src/assets', to: 'assets2' },
  ])
].concat(sourceMap);

const devPlugins = [
  new webpack.NoErrorsPlugin()
];

const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
];

const plugins = basePlugins
  .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);

module.exports = {
  entry: {
    app: appEntries,
    vendor: [
      'es5-shim',
      'es6-shim',
      'es6-promise',
      'react',
      'react-dom',
      'react-router',
      'redux',
      'react-redux',
      'q'
    ]
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
    sourceMapFilename: '[name].[hash].js.map',
    chunkFilename: '[id].chunk.js'
  },

  devtool: process.env.NODE_ENV === 'production' ?
    'source-map' :
    'inline-source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.tsx', '.ts', '.js']
  },

  plugins: plugins,

  devServer: {
    historyApiFallback: { index: '/' },
    contentBase: './src'
  },

  module: {
    preLoaders: [
      loaders.tslint,
    ],
    loaders: [
      loaders.tsx,
      loaders.html,
      loaders.scss,
      loaders.svg,
      loaders.eot,
      loaders.woff,
      loaders.woff2,
      loaders.ttf,
    ]
  }
};
