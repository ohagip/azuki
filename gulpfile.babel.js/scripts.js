import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import prettierEslint from '@tiaanduplessis/gulp-prettier-eslint';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';
import config from '../config';
import webpackConfig from '../webpack.config';

const $ = gulpLoadPlugins();

function runPrettier(callback) {
  if (config.isWatch === true) {
    callback();
  } else {
    const s = gulp
      .src(config.paths.script.prettierSrc)
      .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
      .pipe(prettierEslint(config.settings.prettierEslint))
      .pipe(gulp.dest(config.paths.script.dir));
    return s;
  }
}

function runWebpack() {
  const s = gulp
    .src(config.paths.script.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe(named(file =>
      // entryをsrcを元に作成
      file.relative.replace(/.[^.]+$/, '')))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(config.paths.script.dist));
  return s;
}

// headタグで読み込みscripts
function runLibsHead(callback) {
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
}

// bodyタグ末尾で読み込みscripts
function runLibsBody(callback) {
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
}

export const scripts = gulp.series(runPrettier, runWebpack);
export const scriptLibs = gulp.series(runLibsHead, runLibsBody);