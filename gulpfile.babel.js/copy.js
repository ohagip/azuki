import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();

export default function copy() {
  const s = gulp
    .src(config.paths.static.src, { dot: true })
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.if(config.isWatch, $.changed(config.paths.static.dist)))
    .pipe(gulp.dest(config.paths.static.dist));
  return s;
}