var gulp = require("gulp");
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var browserify = require('browserify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var open = require('gulp-open');
var streamConvert = require('vinyl-source-stream');

var EXPRESS_PORT = 8081;

//COMPILATION
gulp.task('libs', function() {
	gulp.src(['./bower_components/jquery/dist/jquery.min.js',
		'./bower_components/underscore/underscore.js',
		'./bower_components/backbone/backbone.js'
	])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('./lib'));
});
gulp.task('coffee', function() {
	gulp.src('./src/*.coffee')
		.pipe(coffee({
			bare: true
		}).on('error', gutil.log))
		.pipe(gulp.dest('./lib/'));
});

gulp.task('copy', function() {
	gulp.src(['./src/**/*.js', './src/*.css', './src/**/*.hbs'])
		.pipe(gulp.dest('./lib/'));
});

//DEMO
gulp.task('browserifyDemo', function() {
	var bundler = browserify('./lib/demo.js');
	bundler.bundle()
		.pipe(streamConvert('bundle.js'))
		.pipe(gulp.dest('./demo'));
});
gulp.task('startExpress', function() {
	var express = require("express");
	var app = express();
	app.use(express.static(__dirname));
	app.listen(EXPRESS_PORT);
	console.log("Server started on port " + EXPRESS_PORT);
});
gulp.task('watch', function() {
	gulp.watch('./src/demo.js', ['browserifyDemo']);
	gulp.watch(['./src/*.coffee', './test/*.coffee', './src/templates/*.hbs'], ['compile', 'browserifyDemo']);
	gulp.watch(['./test/*.coffee', './src/*.coffee'], ['browserifyTests']);
});
gulp.task('ngrok', function() {
	require('ngrok').connect(EXPRESS_PORT, function (err, url) {
		console.log("Public Url is:\n%s", url);
	});
});
gulp.task('openBrowser', function() {
	var options = {
		url: "http://localhost:" + EXPRESS_PORT + "/demo/demo.html"
	};
	gulp.src("./demo/demo.html").pipe(open("", options));
});

gulp.task('compile', ['coffee', 'copy', 'libs']);
gulp.task('demo', ['compile', 'browserifyDemo', 'startExpress', 'watch', 'ngrok', 'openBrowser']);
gulp.task('default', ['demo']);
gulp.task('test', ['browserifyTests', 'watch']);