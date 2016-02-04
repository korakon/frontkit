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

/*
 * CONFIG
 */

const config = {
  production: process.env.NODE_ENV === 'production',
  dirs: {
    build: './build',
    src: './src',
  },
  entries: {
    //  File path -> build name
    css: { entry: 'src/index.css', output: 'style.css' },
    html: { entry: 'src/index.html', output: 'index.html' },
    js: { entry: './src/index.js', output: 'app.js', expose: 'app' },
    vendor: { output: 'vendor.js' },
  },
  vendor: Object.keys(pkg.dependencies || {}),
};

// So, you can import your code without specifying relative paths
process.env.NODE_PATH = config.dirs.src;

// Remove redux-logger from production builds.
if (!config.production) config.vendor.splice(config.vendor.indexOf('redux-logger'), 1);
const processors = [require('postcss-import')(),
                    require('postcss-simple-vars')(),
                    require('postcss-nested')(),
                    require('postcss-color-function')(),
                    require('autoprefixer')({ browsers: ['last 1 version'] })];

/*
 * ERROR HANDLING
 */

function onerror(e) {
  gutil.log(gutil.colors.red("ERROR:"), e.message);
  this.emit('end');
}

/*
 * VENDOR
 */

gulp.task('vendor', () => {
  const b = browserify();
  b.require(config.vendor);
  return b.bundle()
    .pipe(source(config.entries.vendor.output))
    .pipe(gulp.dest(config.dirs.build));
});

/*
 * SCRIPTS
 */

gulp.task('scripts', () => {
  const bundler = browserify({
    debug: !config.production,
    cache: {},
    transform: [
      babelify,
    ],
    packageCache: {},
    plugin: config.production ? [] : [watchify],
  });

  bundler.require(config.entries.js.entry, { expose: config.entries.js.expose });
  bundler.on('log', gutil.log.bind(gutil, 'Watchify: '));
  config.vendor.forEach((v) => { bundler.ignore(v); bundler.external(v); });

  function bundle() {
    return bundler
      .bundle()
      .on('error', onerror)
      .pipe(source(config.entries.js.output))
      .pipe(gulp.dest(config.dirs.build))
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
  return gulp.src(config.entries.css.entry)
    .pipe(plumber(onerror))
    .pipe(postcss(processors))
    .pipe(rename(config.entries.css.output))
    .pipe(gulp.dest(config.dirs.build))
    .pipe(browserSync.stream());
});

/*
 * HTML
 */

gulp.task('html', () => {
  return gulp.src(config.entries.html.entry)
    .pipe(rename(config.entries.html.output))
    .pipe(gulp.dest(config.dirs.build))
    .pipe(browserSync.stream());
});

/*
 * WATCH
 */

gulp.task('watch:html', () => {
  return gulp.watch('./src/**/*.html', ['html']);
});

gulp.task('watch:scripts', () => {
  return gulp.watch(['*.js', './src/**/*.js'], ['scripts:lint']);
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

gulp.task('default', ['vendor', 'scripts', 'styles', 'html', 'serve', 'watch']);
