var gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	istanbul = require('gulp-istanbul'),

	JS_PATH_SERVER = "/home/parse/cloud_dir/cloud/",
	TEST_PATH_SERVER = "./tests/";

function handleError(err) {
	console.error(err);
}


gulp.task('pre-test', function () {
	return gulp.src([JS_PATH_SERVER + '**/*.js'])
		.pipe(istanbul({includeUntested: true}))
		.pipe(istanbul.hookRequire());
});

gulp.task('run-test', ['pre-test'], function() {
	return gulp.src(TEST_PATH_SERVER + '**/*.js', {read: false})
		.pipe(mocha({reporter: 'spec'}))
		.on("error", handleError);

});