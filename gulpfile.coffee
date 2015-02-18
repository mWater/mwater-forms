gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee' 
glob = require 'glob'
extractor = require('ez-localize/extractor')
source = require 'vinyl-source-stream'
browserify = require 'browserify'
coffeeify = require 'coffeeify'
hbsfy = require 'hbsfy'

# Compile coffeescript to js in lib/
gulp.task 'coffee', ->
  gulp.src('./src/*.coffee')
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
  files = glob.sync("./test/*Tests.coffee");
  bundler = browserify({ entries: files, extensions: [".js", ".coffee"] })
  stream = bundler.bundle()
    .on('error', gutil.log)
    .on('error', -> throw "Failed")
    .pipe(source('browserified.js'))
    .pipe(gulp.dest('./test/'))
  return stream


gulp.task 'compile', gulp.series('coffee', 'copy', 'localize')

gulp.task 'default', gulp.series('compile')