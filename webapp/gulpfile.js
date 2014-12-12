var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var browserify = require('browserify');
var browserifyShim = require('browserify-shim');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var log = gutil.log;
var browserSync = require('browser-sync');
var reload = browserSync.reload;

process.env.BROWSERIFYSHIM_DIAGNOSTICS=1;

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

// watch files for changes and reload
gulp.task('serve', ['watch'], function() {
  browserSync({
    proxy: 'insurance.dev:8080'
  });
  return gulp.watch(['**/*.html', '**/*.less', '**/*.css', '**/*.js'], {cwd: 'dist'}, reload);
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

gulp.task('js', function() {
  var bundler = browserify({
    entries: ['./src/index.js'],
    debug: true
  });
  return processBundle(bundler);
});

gulp.task('watch-js', function() {
  var bundler = watchify(browserify('./src/index.js', watchify.args));
  var rebundle = function() {
    return processBundle(bundler);
  };
  bundler.on('update', rebundle);
  return rebundle();
});

gulp.task('watch', ['watch-html', 'watch-js', 'watch-less']);

gulp.task('default', ['js', 'html', 'less']);
