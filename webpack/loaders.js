'use strict';

exports.json = {
  test: /\.json$/,
  loader: 'json'
};

exports.tslint = {
  test: /\.tsx?$/,
  loader: 'tslint',
  exclude: /(node_modules|imperaClients\.ts$)/
};

exports.tsx = {
  test: /\.tsx?$/,
  loaders: [
    "react-hot-loader/webpack",
    "awesome-typescript-loader"
  ],
  exclude: /(node_modules|test-utils|\.test\.ts$)/
};

exports.istanbulInstrumenter = {
  test: /^(.(?!\.test))*\.tsx?$/,
  loader: 'istanbul-instrumenter-loader',
  query: {
    embedSource: true,
  },
};

exports.html = {
  test: /\.html$/,
  loader: 'raw',
  exclude: /node_modules/
};

exports.scss = {
  test: /\.s?css$/,
  loaders: ["style", "css", "sass"]
};

exports.svg = makeUrlLoader(/\.svg$/);
exports.eot = makeUrlLoader(/\.eot$/);
exports.woff = makeUrlLoader(/\.woff$/);
exports.woff2 = makeUrlLoader(/\.woff2$/);
exports.ttf = makeUrlLoader(/\.ttf$/);

function makeUrlLoader(pattern) {
  return {
    test: pattern,
    loader: 'url'
  };
}
