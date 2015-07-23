'use strict';

var _ = require('lodash');
var del = require('del');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var runSequence = require('run-sequence');

var webpack = require('webpack');

var config = require('./build.config');
var webpackConfig = require('./webpack.config');

var compiler = webpack(webpackConfig);

gulp.task('js', function()
{
	return gulp.src([config.dirs.source + '/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(gulp.dest(config.dirs.build));
});

gulp.task('test-cli', ['js'], function()
{
	return gulp.src([config.dirs.test + '/**/*.spec.js'])
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', function(cb)
{
	gulp.watch([config.dirs.source + '/**/*.js', config.dirs.test + '/**/*.js'], ['js', 'test']);
	gulp.watch([config.dirs.test + '**/*.js'], ['test']);
	cb();
});

gulp.task('clean', function(cb)
{
	return del([
		config.dirs.build + '/**/*',
		config.dirs.compile + '/**/*'
	], cb);
});

gulp.task('compile', ['build'], function(cb)
{
	compiler.run(function(err, stats)
	{
		if (err)
		{
			console.log(err);
		}
		cb();
	});
});


gulp.task('build', function(cb)
{
	return runSequence('clean', ['js', 'test-cli'], cb);
});

gulp.task('default', function(cb)
{
	return runSequence('build', 'watch', cb);
});
