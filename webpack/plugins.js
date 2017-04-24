const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackGitHash = require('webpack-git-hash');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
    new ProgressBarPlugin(),
    new CopyWebpackPlugin([
        { from: './src/assets', to: './assets' },
        { from: './src/assets', to: 'assets2' },
    ])
].concat(sourceMap);

const devPlugins = [
    new webpack.NoErrorsPlugin(),    
    new WebpackGitHash()
];

const prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new WebpackGitHash({
        callback: function(hash) {
            var indexHtml = fs.readFileSync('./src/index.html', 'utf8');
            indexHtml = indexHtml.replace(/\[hash\]/, hash);
            fs.writeFileSync('./dist/index.html', indexHtml);
        }
    }),
    new BundleAnalyzerPlugin({
        analyzerMode: 'static'
    })
];

module.exports = basePlugins
    .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
    .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);