var browserSync = require('browser-sync');
var browserify = require('browserify');
var browserifyShim = require('browserify-shim');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var stringify = require('stringify');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var log = gutil.log;
var reload = browserSync.reload;

var prod = process.env.NODE_ENV === 'prod';

var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name;
  return version + '.' + name + '.' + 'min';
};

gulp.task('html', function() {
  log('html ftw!');
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch-html', ['html'], function() {
  return gulp.watch('src/**/*.html', ['html']);
});


gulp.task('less', function() {
  return gulp.src('src/**/*.less')
    .pipe(less({
      paths: [ 'src/main.less' ]
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch-less', ['less'], function() {
  return gulp.watch('src/**/*.less', ['less']);
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

var processBundle = function(bundler) {
  var bundle = function() {
    log('Bundling JS');
    return bundler
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(getBundleName() + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
  };
  return bundle();
};

var createBundler = function() {
  return browserify({
    entries: ['./src/index.js'],
    debug: !prod,
    cache: {},
    packageCache: {},
    fullPaths: true
  }).transform(stringify({ extensions:['.html'], minify: true }));
};

gulp.task('js', ['lint'], function() {
  return processBundle(createBundler());
});

gulp.task('watch-js', function() {
  var bundler = watchify(createBundler());
  var rebundle = function() {
    return processBundle(bundler);
  };
  bundler.on('update', rebundle);
  return rebundle();
});

gulp.task('watch', ['watch-html', 'watch-js', 'watch-less']);

// watch files for changes and reload
gulp.task('serve', ['watch'], function() {
  browserSync({
    proxy: 'insurance.dev:8080'
  });
  return gulp.watch(['**/*.html', '**/*.less', '**/*.css', '**/*.js'], {cwd: 'dist'}, reload);
});

gulp.task('default', ['js', 'html', 'less']);
