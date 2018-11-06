import gulp from 'gulp';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();

gulp.task('lint', (callback) => {
  runSequence('lint:views', 'lint:styles', 'lint:scripts', callback);
});

gulp.task('lint:views', () => {
  const s = gulp
    .src(`${config.paths.view.dist}/**/*.html`)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.htmlhint('.htmlhintrc'))
    .pipe($.htmlhint.reporter());
  return s;
});

gulp.task('lint:styles', () => {
  const s = gulp
    .src(config.paths.style.watch)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.sassLint(config.settings.sassLint))
    .pipe($.sassLint.format());
  return s;
});

gulp.task('lint:scripts', () => {
  const s = gulp
    .src(config.paths.script.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.eslint(config.settings.eslint))
    .pipe($.eslint.format());
  return s;
});
