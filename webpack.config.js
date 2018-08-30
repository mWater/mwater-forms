path = require('path');

module.exports = {
  entry: ['./src/demo.coffee'],
  devtool: "eval",
  mode: "development",
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'dist', 'js')
  },
  module: {
    rules: [
      // Added transform-runtime to prevent needing polyfill
      { test: /\.coffee$/, use: [{ loader: "coffee-loader", options: { transpile: { presets: ["env"], "plugins": ["babel-plugin-transform-runtime"]}}}]},
      { test: /\.hbs$/, use: [{ loader: "handlebars-loader" }] }
    ]
  },
  resolve: {
    extensions: [".coffee", ".js", ".json"],
  },
  externals: {
    jquery: "$",
    lodash: '_',
    backbone: 'Backbone'
  }
};
