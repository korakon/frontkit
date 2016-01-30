'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    babelify = require('babelify'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    browserSync = require('browser-sync').create(),
    spawn = require('child_process').spawn,
    historyApiFallback = require('connect-history-api-fallback'),
    pkg = require('./package.json');

// So, you can import your code without specifying relative paths
process.env['NODE_PATH'] = './src';
var production = process.env['NODE_ENV'] === 'production';
var vendor = Object.keys(pkg.dependencies);
var processors = [require('postcss-import')(),
                  require('postcss-simple-vars')(),
                  require('postcss-nested')(),
                  require('postcss-color-function')(),
                  require('autoprefixer')({browsers: ['last 1 version']})];

function error(e) {
    gutil.log(gutil.colors.red(e.message));
    if (e.stack) gutil.log(e.stack);
    this.emit('end');
}

/*
 * VENDOR
 */

gulp.task('vendor', () =>  {
    var b = browserify();

    b.require(vendor);

    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('./build'));
});

/*
 * SCRIPTS
 */

gulp.task('scripts', () =>  {
    var bundler = browserify({
        debug: production ? false : true,
        cache: {},
        transform: [
            babelify
        ],
        packageCache: {},
        plugin: production ? [] : [watchify]
    });

    bundler.require('./src/index.js', {expose: 'app'});
    bundler.on('log', gutil.log.bind(gutil, 'Watchify '));
    vendor.forEach(function(v)  {bundler.ignore(v); bundler.external(v);});

    function bundle() {
        return bundler
            .bundle()
            .on('error', error)
            .pipe(source('app.js'))
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.stream());
    }

    bundler.on('update', bundle);

    return bundle();
});

/*
 * LINT
 */

gulp.task('scripts:lint', () => {
    return spawn('./node_modules/.bin/eslint', ['--cache', './src/**/*.js'],
                 {stdio: 'inherit'});
});

/*
 * STYLES
 */

gulp.task('styles', () =>  {
    return gulp.src('./src/index.css')
        .pipe(plumber(error))
        .pipe(postcss(processors))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

/*
 * HTML
 */

gulp.task('html', () => {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});

/*
 * WATCH
 */

gulp.task('watch:html', () =>  {
    return gulp.watch('./src/**/*.html', ['html']);
});

gulp.task('watch:scripts', () =>  {
    return gulp.watch('./src/**/*.js', ['scripts:lint']);
});

gulp.task('watch:styles', () =>  {
    return gulp.watch('./src/**/*.css', ['styles']);
});

gulp.task('watch', ['watch:styles', 'watch:html', 'watch:scripts']);

gulp.task('serve', () =>  {
    browserSync.init({
        open: false,
        server: {
            baseDir: './build',
            middleware: [historyApiFallback()]
        }
    });
});

gulp.task('default', ['scripts', 'styles', 'html', 'serve', 'watch']);
