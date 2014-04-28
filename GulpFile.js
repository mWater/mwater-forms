var gulp = require("gulp");
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var browserify = require('browserify');
var concat = require('gulp-concat');
var open = require('gulp-open');
var streamConvert = require('vinyl-source-stream');

var EXPRESS_PORT = 8081;

gulp.task('startExpress', function() {
	var express = require("express");
	var app = express();
	app.use(express.static(__dirname));
	app.listen(EXPRESS_PORT);
	console.log("Server started on port " + EXPRESS_PORT);
});

gulp.task('openBrowser', function() {
	var options = {
		url: "http://localhost:" + EXPRESS_PORT + "/demo/demo.html"
	};
	gulp.src("./demo/demo.html").pipe(open("", options));
});


gulp.task('libs', function() {
	gulp.src(['./bower_components/jquery/dist/jquery.min.js',
		'./bower_components/underscore/underscore.js',
		'./bower_components/backbone/backbone.js'
	])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('./lib'));
});

gulp.task('browserify', function() {
	var bundler = browserify('./lib/demo.js');

	bundler.bundle()
		.pipe(streamConvert('bundle.js'))
		.pipe(gulp.dest('./demo'));
});

gulp.task('coffee', function() {
	gulp.src('./src/*.coffee')
		.pipe(coffee({
			bare: true
		}).on('error', gutil.log))
		.pipe(gulp.dest('./lib/'));
});

gulp.task('copy', function() {
	gulp.src(['./src/*.js', './src/*.css', './src/*.hbs'])
		.pipe(gulp.dest('./lib/'));

	gulp.src('./src/templates/*').pipe(gulp.dest('./lib/templates'));
	gulp.src('./src/shims/*').pipe(gulp.dest('./lib/shims'));
});

gulp.task('watch', function() {
	gulp.watch('./lib/demo.js', ['browserify']);
	gulp.watch('./demo/demo.html', ['browserify']);
	gulp.watch('./src/*.coffee', ['coffee', 'copy', 'libs', 'browserify']);
	gulp.watch('./src/templates/*.hbs', ['coffee', 'copy', 'libs', 'browserify']);
});

gulp.task('default', ['coffee', 'copy', 'libs', 'browserify', 'startExpress','watch', 'openBrowser']);