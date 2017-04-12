gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee' 
glob = require 'glob'
extractor = require('ez-localize/extractor')
source = require 'vinyl-source-stream'
browserify = require 'browserify'
coffeeify = require 'coffeeify'
hbsfy = require 'hbsfy'
rework = require 'gulp-rework'
reworkNpm = require 'rework-npm'
concat = require 'gulp-concat'
browserSync = require 'browser-sync'
reload = browserSync.reload
watchify = require 'watchify'
envify = require('envify/custom')
webpack = require 'webpack'
WebpackDevServer = require 'webpack-dev-server'
path = require 'path'

# Compile coffeescript to js in lib/
gulp.task 'coffee', ->
  gulp.src('./src/**/*.coffee')
    .pipe(coffee({ bare: true }))
    .pipe(gulp.dest('./lib/'))

# Copy non-coffeescript files
gulp.task 'copy', ->
  gulp.src(['./src/**/*.js', './src/**/*.hbs'])
    .pipe(gulp.dest('./lib/'))

gulp.task 'localize', (cb) ->
  options = { extensions: ['.js', '.coffee'], transform: [coffeeify, hbsfy] }
  extractor.updateLocalizationFile "src/index.coffee", "localizations.json", options, ->
    cb()

# Compile tests
gulp.task 'prepareTests', ->
  files = glob.sync("./test/**/*Tests.coffee");
  bundler = browserify({ entries: files, extensions: [".js", ".coffee"] })
  stream = bundler.bundle()
    .on('error', gutil.log)
    .on('error', -> throw "Failed")
    .pipe(source('browserified.js'))
    .pipe(gulp.dest('./test/'))
  return stream

makeBrowserifyBundle = ->
  shim(browserify("./demo.coffee",
    extensions: [".coffee"]
    basedir: "./src/"
  ))

bundleDemoJs = (bundle) ->
  # Use production node for performance testing
  # console.log "Using production version of React"
  # bundle = bundle.transform(envify({ NODE_ENV: 'production' }), { global: true })

  bundle.bundle()
    .on("error", gutil.log)
    .pipe(source("demo.js"))
    .pipe(gulp.dest("./dist/js/"))

gulp.task "browserify", ->
  bundleDemoJs(makeBrowserifyBundle())

gulp.task "libs_css", ->
  return gulp.src([
    "./bower_components/bootstrap/dist/css/bootstrap.css"
    "./bower_components/bootstrap/dist/css/bootstrap-theme.css"
  ]).pipe(concat("libs.css"))
    .pipe(gulp.dest("./dist/css/"))

gulp.task "libs_js", ->
  return gulp.src([
    "./bower_components/jquery/dist/jquery.js"
    "./bower_components/bootstrap/dist/js/bootstrap.js"
    "./bower_components/lodash/lodash.js"
    './bower_components/backbone/backbone.js'
  ]).pipe(concat("libs.js"))
    .pipe(gulp.dest("./dist/js/"))

gulp.task "copy_fonts", ->
  return gulp.src(["./bower_components/bootstrap/dist/fonts/*"]).pipe(gulp.dest("./dist/fonts/"))

gulp.task "index_css", ->
 return gulp.src("./src/index.css")
   .pipe(rework(reworkNpm("./src/")))
   .pipe(gulp.dest("./dist/css/"))

gulp.task 'copy_assets', ->
  return gulp.src("assets/**/*")
    .pipe(gulp.dest('dist/'))

gulp.task "demo", gulp.parallel([
  "browserify"
  "libs_js"
  "libs_css"
  "copy_fonts"
  "copy_assets"
  "index_css"
])

gulp.task 'compile', gulp.series('coffee', 'copy', 'localize')

gulp.task 'default', gulp.series('compile')

gulp.task 'watch', gulp.series(["libs_js", "libs_css", "copy_fonts", "copy_assets", "index_css", ->
  webpackConfig = require './webpack.config.js'

  webpackConfig.output.publicPath = 'http://localhost:3006/js/'

  webpackConfig.plugins = [
    # new webpack.HotModuleReplacementPlugin()
    new webpack.NamedModulesPlugin()
  ]
  # webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:3006', 'webpack/hot/only-dev-server');
  webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:3006')
  # # Add hot loader
  # webpackConfig.module.loaders[0].loader.unshift("react-hot-loader/webpack")

  compiler = webpack(webpackConfig)

  # hot: true
  new WebpackDevServer(compiler, { contentBase: "dist", publicPath: "/js/" }).listen 3006, "localhost", (err) =>
    if err 
      throw new gutil.PluginError("webpack-dev-server", err)

    # Server listening
    gutil.log("[webpack-dev-server]", "http://localhost:3006/demo.html")
])

gulp.task "test", gulp.series([
  "copy_assets"
  ->
    webpackConfig = require './webpack.config.tests.js'
    compiler = webpack(webpackConfig)

    new WebpackDevServer(compiler, { }).listen 8081, "localhost", (err) =>
      if err 
        throw new gutil.PluginError("webpack-dev-server", err)

      # Server listening
      gutil.log("[webpack-dev-server]", "http://localhost:8081/mocha.html")
])

# Shim non-browserify friendly libraries to allow them to be 'require'd
shim = (instance) ->
  shims = {
    jquery: '../shims/jquery-shim'
  }

  # Add shims
  for name, path of shims
    instance.require(path, {expose: name})

  return instance
