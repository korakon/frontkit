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
    serveStatic = require('serve-static'),
    path = require('path');


process.env['NODE_PATH'] = './src';

var vendor = ['react',
              'react-dom',
              'path-to-regexp',
              'redux',
              'redux-thunk',
              'redux-actions',
              'redux-logger',
              'rondpoint',
              'history',
              'lodash'];

var processors = [require('postcss-simple-vars')(),
                  require('postcss-nested')(),
                  require('postcss-color-function')(),
                  require('autoprefixer-core')({browsers: ['last 1 version']})];

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
        entries: ['geste/main/index.js'],
        cache: {},
        transform: [
            babelify.configure({
                presets: ["es2015", "stage-0", "react"]
                //sourceMapRelative: path.resolve(__dirname, './geste')
            })
        ],
        packageCache: {},
        plugin: [watchify]
    });

    bundler.on('log', gutil.log.bind(gutil, 'Watchify '));

    vendor.forEach(function(v)  {bundler.ignore(v); bundler.external(v);});

    function bundle() {
        return bundler
            .bundle()
            .on('error', error)
            .pipe(source("geste.js"))
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
    return gulp.src('./geste/main/index.css')
        .pipe(plumber(error))
        .pipe(postcss(processors))
        .pipe(rename('geste.css'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});


gulp.task("watch:styles", function() {
    return gulp.watch("./geste/**/*.css", ['styles']);
});

gulp.task("watch:scripts", function() {
    return gulp.watch("./geste/**/*.js", ['scripts']);
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
