"use strict";

const path = require("path");
const webpack = require("webpack");
const loaders = require("./webpack/loaders");
const plugins = require("./webpack/plugins");

// Prod plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const I18nPlugin = require("i18n-webpack-plugin");

const languages = {
    "en": null,
    "de": require("./loc/de.json")
};

const defaultLanguage = "en";

const appEntries = [
    "react-hot-loader/patch",
    "whatwg-fetch",
    "./src/index.tsx",
];

const config = (lang) => {
    return {
        entry: {
            app: appEntries
        },

        output: {
            path: path.join(__dirname, "dist"),
            filename: (lang || defaultLanguage) + ".[name]" + (process.env.NODE_ENV === "production" ? ".[githash]" : "") + ".js",
            publicPath: "/",
            sourceMapFilename: "[name].[hash].js.map"
        },

        devtool: process.env.NODE_ENV === "production" ?
            "source-map" :
            "source-map",

        resolve: {
            extensions: ["", ".webpack.js", ".web.js", ".tsx", ".ts", ".js"]
        },

        plugins: plugins.concat([
            new I18nPlugin(languages[lang])]),

        devServer: {
            historyApiFallback: { index: "/" },
            contentBase: "./src"
        },

        module: {
            preLoaders: [
                loaders.tslint,
            ],
            loaders: [
                loaders.json,
                loaders.tsx,
                loaders.html,
                loaders.scss,
                loaders.svg,
                loaders.eot,
                loaders.woff,
                loaders.woff2,
                loaders.ttf,
                { test: /jquery\.js$/, loader: "expose?jQuery!expose?$" }
            ]
        }
    };
};

if (process.env.NODE_ENV === "development" || process.env.TEST) {
    module.exports = config("en");
} else {
    module.exports = Object.keys(languages).map(lang => config(lang));
}
