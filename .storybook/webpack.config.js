path = require('path');

module.exports = {
  module: {
    rules: [
      { test: /\.coffee$/, loader: "coffee-loader" }
    ]
  },
  resolve: {
    extensions: [".coffee", ".js", ".json"],
  },
  externals: {
    jquery: "$"
  }
};
