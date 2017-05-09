var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var autop = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');

var tsProjectDev = ts.createProject('tsconfig.json');
var tsProjectProd = ts.createProject('tsconfig.json');

/**
 * Handles the file generation for SASS files in a development environment.
 *
 * Build order:
 * - Sourcemaps
 * - SASS
 * - Auto pre-fixer
 * - Renames the file to checkout-woocommerce-front.css
 * - Writes the source map in the same directory as the css file
 * - Push the files to the destination
 * - Notify of task completion
 */
gulp.task('sass:front:dev', function() {
	return gulp.src('sources/scss/front/front.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autop())
		.pipe(rename("checkout-woocommerce-front.css"))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('assets/front/css'))
		.pipe(notify({ message: "[sass:front:dev completed]", onLast: true }))
});

/**
 * Handles the file generation for SASS files in a production environment.
 *
 * Build order:
 * - SASS
 * - Auto pre-fixer
 * - Minification
 * - Renames the file to checkout-woocommerce-front.min.css
 * - Push the files to the destination
 * - Notify of task completion
 */
gulp.task('sass:front:prod', function() {
	return gulp.src('sources/scss/front/front.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autop())
		.pipe(cssnano())
		.pipe(rename("checkout-woocommerce-front.min.css"))
		.pipe(gulp.dest('assets/front/css'))
		.pipe(notify({ message: "[sass:front:prod completed]", onLast: true }))
});

/**
 * Handles the file generation for TypeScript files in a development environment.
 *
 * Build order:
 * - Source maps
 * - tsProjectDev
 * - Writes the source map in the same directory as the compiled js file
 * - Push the files to the destination
 * - Notify of task completion
 */
gulp.task('typescript:front:dev', function() {
	return gulp.src('sources/ts/front/CFW/Main.ts')
		.pipe(sourcemaps.init())
		.pipe(tsProjectDev())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('assets/front/js'))
		.pipe(notify({ message: "[typescript:front:dev completed]", onLast: true }))
});

/**
 * Handles the file generation for TypeScript files in a production environment.
 *
 * Build order:
 * - tsProjectProd
 * - Uglify
 * - Renames the out file to checkout-woocommerce-front.min.js
 * - Push the files to the destination
 * - Notify of task completion
 */
gulp.task('typescript:front:prod', function() {
	return gulp.src('sources/ts/front/CFW/Main.ts')
		.pipe(tsProjectProd())
		.pipe(uglify())
		.pipe(rename("checkout-woocommerce-front.min.js"))
		.pipe(gulp.dest('assets/front/js'))
		.pipe(notify({ message: "[typescript:front:prod completed]", onLast: true }))
});

/**
 * Cleans the directories specified of files.
 */
gulp.task('clean', function() {
	return del([
		'assets/front/css',
		'assets/front/js',
		'assets/admin/css',
		'assets/admin/js'
	]);
});

/**
 * File watchers for SASS and Babel files
 */
gulp.task('watch', function() {
	gulp.watch([
		'sources/scss/front/**/*.scss',
		'sources/scss/resources/grid/*.scss'
	], ['sass:front:dev']);

	gulp.watch([
		'sources/ts/front/**/*.ts'
	], ['typescript:front:dev'])
});

/**
 *
 */
gulp.task('default', ['clean'], function() {
	gulp.start('sass:front:dev', 'sass:front:prod', 'typescript:front:dev', 'typescript:front:prod');
});