import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import config from '../config';

const $ = gulpLoadPlugins();
const browser = browserSync.create();
const serverSetting = _.merge({}, config.settings.server, config.settings.jsdoc.server);

gulp.task('jsdoc', (callback) => {
  gulp
    .src(config.paths.jsdoc.src, { read: false })
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.jsdoc3(config.settings.jsdoc, callback));
});

gulp.task('jsdocServer', (callback) => {
  browser.init(serverSetting);
  callback();
});

gulp.task('jsdocServer:reload', (callback) => {
  browser.reload();
  callback();
});
