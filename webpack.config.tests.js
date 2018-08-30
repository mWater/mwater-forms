module.exports = {
  entry: ['webpack-dev-server/client?http://localhost:8081', './test/index.js'],
  devtool: "eval",
  mode: "development",
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  module: {
    rules: [
      // Added transform-runtime to prevent needing polyfill
      { test: /\.coffee$/, use: [{ loader: "coffee-loader", options: { transpile: { presets: ["env"], "plugins": ["babel-plugin-transform-runtime"]}}}]},
      { test: /\.hbs$/, use: [{ loader: "handlebars-loader" }] }
    ]
  },
  resolve: {
    extensions: [".coffee", ".js", ".json"]
  },
  externals: {
  }
};
