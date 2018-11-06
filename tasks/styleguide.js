import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import config from '../config';

const $ = gulpLoadPlugins();
const browser = browserSync.create();
const serverSetting = _.merge({}, config.settings.server, config.settings.styleguide.server);

gulp.task('styleguide', () => {
  const s = gulp
    .src(`${config.paths.styleguide.dir}aigis_config.yml`)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.aigis());
  return s;
});

gulp.task('styleguideServer', (callback) => {
  browser.init(serverSetting);
  callback();
});

gulp.task('styleguideServer:reload', (callback) => {
  browser.reload();
  callback();
});
