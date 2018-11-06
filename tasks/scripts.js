import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';
import config from '../config';
import webpackConfig from '../webpack.config';

const $ = gulpLoadPlugins();

gulp.task('scripts', (callback) => {
  runSequence('scripts:prettier', 'scripts:webpack', callback);
});

gulp.task('scripts:prettier', (callback) => {
  if (config.isWatch === true) {
    callback();
  } else {
    const s = gulp
      .src(config.paths.script.prettierSrc)
      .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
      .pipe($.prettierEslint())
      .pipe(gulp.dest(config.paths.script.dir));
    return s;
  }
});

gulp.task('scripts:webpack', () => {
  const s = gulp
    .src(config.paths.script.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe(named(file =>
    // entryをsrcを元に作成
      file.relative.replace(/.[^.]+$/, '')))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(config.paths.script.dist));
  return s;
});

gulp.task('scripts:libs', (callback) => {
  runSequence('scripts:libs-head', 'scripts:libs-body', callback);
});

// headタグで読み込みscripts
gulp.task('scripts:libs-head', (callback) => {
  const libs = config.paths.script.libsHead;
  if (Array.isArray(libs) === false || libs.length === 0) {
    callback();
    return;
  }
  const s = gulp
    .src(config.paths.script.libsHead)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.concat('lib-head.js'))
    .pipe(gulp.dest(config.paths.script.dist));
  return s;
});

// bodyタグ末尾で読み込みscripts
gulp.task('scripts:libs-body', (callback) => {
  const libs = config.paths.script.libs;
  if (Array.isArray(libs) === false || libs.length === 0) {
    callback();
    return;
  }
  const s = gulp
    .src(config.paths.script.libs)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.concat('libs.js'))
    .pipe(gulp.dest(config.paths.script.dist));
  return s;
});
