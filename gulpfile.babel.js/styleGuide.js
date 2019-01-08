import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import config from '../config';

const $ = gulpLoadPlugins();
const browser = browserSync.create();
const serverSetting = _.merge({}, config.settings.server, config.settings.styleguide.server);


export function styleGuide() {
  const s = gulp
    .src(`${config.paths.styleguide.dir}aigis_config.yml`)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.aigis());
  return s;
}

export function styleGuideServer(callback) {
  browser.init(serverSetting);
  callback();
}

export function reloadStyleGuideServer(callback) {
  browser.reload();
  callback();
}