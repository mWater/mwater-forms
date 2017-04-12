path = require('path');

module.exports = {
  entry: ['./src/demo.coffee'],
  devtool: "eval",
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'dist', 'js')
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: ["coffee-loader"] },
      { test: /\.hbs$/, loader: "handlebars-loader" }
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
