import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();

export function lintViews() {
  const s = gulp
    .src(`${config.paths.view.dist}/**/*.html`)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.htmlhint('.htmlhintrc'))
    .pipe($.htmlhint.reporter());
  return s;
}

export function lintStyles() {
  const s = gulp
    .src(config.paths.style.watch)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.sassLint(config.settings.sassLint))
    .pipe($.sassLint.format());
  return s;
}

export function lintScripts() {
  const s = gulp
    .src(config.paths.script.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.eslint(config.settings.eslint))
    .pipe($.eslint.format());
  return s;
}
