import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import config from '../config';

const $ = gulpLoadPlugins();
const browser = browserSync.create();
const serverSetting = _.merge({}, config.settings.server, config.settings.jsdoc.server);

export function jsDoc(callback) {
  gulp
    .src(config.paths.jsdoc.src, { read: false })
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.jsdoc3(config.settings.jsdoc, callback));
}

export function jsDocServer(callback) {
  browser.init(serverSetting);
  callback();
}

export function reloadJsDocServer(callback) {
  browser.reload();
  callback();
}