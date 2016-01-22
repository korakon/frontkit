"use strict";

var gulp = require("gulp"),
    gutil = require('gulp-util'),
    browserify = require("browserify"),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    babelify = require('babelify'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    browserSync = require('browser-sync').create(),
    serveStatic = require('serve-static');

// So, you can import your code without specifying relative paths
process.env['NODE_PATH'] = './src';
var production = process.env['NODE_ENV'] === 'production';

var vendor = ['react',
              'react-dom',
              'redux',
              'redux-actions',
              'redux-logger',
              'rondpoint',
              'history',
              'lodash'];

var processors = [require('postcss-import')(),
                  require('postcss-simple-vars')(),
                  require('postcss-nested')(),
                  require('postcss-color-function')(),
                  require('autoprefixer')({browsers: ['last 1 version']})];

function error(e) {
    gutil.log(gutil.colors.red(e.message));
    if (e.stack) gutil.log(e.stack);
    this.emit('end');
};

/*
 * VENDOR
 */

gulp.task('vendor', function() {
    var b = browserify();

    b.require(vendor);

    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('./build'));
});


/*
 * SCRIPTS
 */


gulp.task('scripts', function() {
    var bundler = browserify({
        debug: true,
        entries: ['src/index.js'],
        cache: {},
        transform: [
            babelify,
        ],
        packageCache: {},
        plugin: production ? [] : [watchify]
    });

    bundler.on('log', gutil.log.bind(gutil, 'Watchify '));

    vendor.forEach(function(v)  {bundler.ignore(v); bundler.external(v);});

    function bundle() {
        return bundler
            .bundle()
            .on('error', error)
            .pipe(source("app.js"))
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.stream());
    }

    bundler.on('update', bundle);

    return bundle();
});


/*
 * STYLES
 */


gulp.task('styles', function() {
    let g = gulp.src('./src/index.css')
            .pipe(plumber(error))
            .pipe(postcss(processors))
            .pipe(rename('style.css'))
            .pipe(gulp.dest('./build'));
    if (!production)
        g = g.pipe(browserSync.stream());
    return g;
});


/*
 * WATCH
 */


gulp.task("watch:styles", function() {
    return gulp.watch("./src/**/*.css", ['styles']);
});

gulp.task("watch:scripts", function() {
    return gulp.watch("./src/**/*.js", ['scripts']);
});

gulp.task('watch', ['watch:styles']);


gulp.task('serve', function() {
    browserSync.init({
        open: false,
        proxy: {
            // proxy the backend server
            target: 'localhost:5000',
            // but serve static files from ./build
            middleware: serveStatic('build')
        }
    });
});

gulp.task("default", ['scripts', 'serve', 'watch']);
