const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const babelify = require('babelify');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync').create();
const spawn = require('child_process').spawn;
const historyApiFallback = require('connect-history-api-fallback');
const pkg = require('./package.json');

// So, you can import your code without specifying relative paths
process.env.NODE_PATH = './src';
const debug = process.env.NODE_ENV !== 'production';
const vendor = Object.keys(pkg.dependencies);
if (!debug) vendor.splice(vendor.indexOf('redux-logger'), 1);
const processors = [require('postcss-import')(),
                    require('postcss-simple-vars')(),
                    require('postcss-nested')(),
                    require('postcss-color-function')(),
                    require('autoprefixer')({ browsers: ['last 1 version'] })];

function onerror(e) {
  gutil.log(gutil.colors.red(e.message));
  if (e.stack) gutil.log(e.stack);
  this.emit('end');
}

/*
 * VENDOR
 */

gulp.task('vendor', () => {
  const b = browserify();
  b.require(vendor);
  return b.bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest('./build'));
});

/*
 * SCRIPTS
 */

gulp.task('scripts', () => {
  const bundler = browserify({
    debug,
    cache: {},
    transform: [
      babelify,
    ],
    packageCache: {},
    plugin: debug ? [watchify] : [],
  });

  bundler.require('./src/index.js', { expose: 'app' });
  bundler.on('log', gutil.log.bind(gutil, 'Watchify '));
  vendor.forEach((v) => { bundler.ignore(v); bundler.external(v); });

  function bundle() {
    return bundler
      .bundle()
      .on('error', onerror)
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
  spawn('./node_modules/.bin/eslint',
        ['--cache', '**/*.js'],
        { stdio: 'inherit' });
});

/*
 * STYLES
 */

gulp.task('styles', () => {
  return gulp.src('./src/index.css')
    .pipe(plumber(onerror))
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

gulp.task('watch:html', () => {
  return gulp.watch('./src/**/*.html', ['html']);
});

gulp.task('watch:scripts', () => {
  return gulp.watch('./src/**/*.js', ['scripts:lint']);
});

gulp.task('watch:styles', () => {
  return gulp.watch('./src/**/*.css', ['styles']);
});

gulp.task('watch', ['watch:styles', 'watch:html', 'watch:scripts']);

gulp.task('serve', () => {
  browserSync.init({
    open: false,
    server: {
      baseDir: './build',
      middleware: [historyApiFallback()],
    },
  });
});

gulp.task('default', ['scripts', 'styles', 'html', 'serve', 'watch']);
