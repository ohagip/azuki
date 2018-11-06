import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();

gulp.task('images', () => {
  const s = gulp
    .src(config.paths.image.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.if(config.isWatch, $.changed(config.paths.image.dist)))
    .pipe($.if(config.settings.image.minify, $.imagemin()))
    .pipe(gulp.dest(config.paths.image.dist));
  return s;
});
