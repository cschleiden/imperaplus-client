const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const sourceMap = process.env.TEST || process.env.NODE_ENV !== "production"
    ? [new webpack.SourceMapDevToolPlugin({ filename: null, test: /\.tsx?$/ })]
    : [];

const basePlugins = [
    new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
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

module.exports = basePlugins
    .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
    .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);