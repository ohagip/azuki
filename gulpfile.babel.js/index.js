import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import minimist from 'minimist';
import config from '../config';

import { server, reloadServer } from './server';
import apiServer from './apiServer';
import { clean, cleanDoc } from './clean';
import copy from './copy';
import views from './views';
import { scripts, scriptLibs } from './scripts';
import styles from './styles';
import images from './images';
import { styleGuide } from './styleGuide';
import { jsDoc } from './jsDoc';
import { lintViews, lintStyles, lintScripts } from './lint';
import sharePage from './sharePage';
// import svgSprite from './svgSprite';
// import iconFont from './iconfont';

const $ = gulpLoadPlugins();
const argv = minimist(process.argv.slice(2));
const isWatchDoc = argv.watch === 'true';
const defaultTasks = [];
const documentTasks = [];

function watchDefault(callback) {
  config.isWatch = true;

  const imagesWatcher = gulp.watch(
    config.paths.image.watch,
    gulp.series(images, reloadServer),
  );
  const staticWatcher = gulp.watch(
    config.paths.static.watch,
    gulp.series(copy, reloadServer),
  );

  gulp.watch(
    config.paths.view.watch,
    gulp.series(views, reloadServer),
  );
  gulp.watch(
    config.paths.style.watch,
    gulp.series(styles, reloadServer),
  );
  gulp.watch(
    config.paths.script.watch,
    gulp.series(scripts, reloadServer),
  );
  // gulp.watch(
  //   config.paths.svgSprite.watch,
  //   gulp.series(svgSprite, reloadServer),
  // );
  // gulp.watch(
  //   config.paths.iconFont.watch,
  //   gulp.series(iconFont, reloadServer),
  // );

  imagesWatcher.on('unlink', (filePath) => {
    const filePathFromSrc = path.relative(config.paths.image.dir, filePath);
    const destFilePath = path.resolve(config.paths.image.dist, filePathFromSrc);
    del.sync(destFilePath);
  });
  staticWatcher.on('unlink', (filePath) => {
    const filePathFromSrc = path.relative(config.paths.static.dir, filePath);
    const destFilePath = path.resolve(config.paths.static.dist, filePathFromSrc);
    del.sync(destFilePath);
  });

  callback();
}

function watchDocument(callback) {
  config.isWatch = true;
  gulp.watch(
    config.paths.style.watch,
    gulp.series(styles, styleGuide, reloadServer),
  );
  gulp.watch(
    config.paths.script.watch,
    gulp.series(scripts, jsDoc, reloadServer),
  );
  callback();
}

function replaceDocument() {
  const { contentsPath } = config.constants;
  const s = gulp
    .src([`${config.paths.styleguide.dist}**/*.html`, `${config.paths.styleguide.dist}**/*.css`])
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.replace(
      'href="/doc/styleguide/aigis_assets/',
      `href="${contentsPath}doc/styleguide/aigis_assets/`,
    ))
    .pipe($.replace(
      'src="/doc/styleguide/aigis_assets/',
      `src="${contentsPath}doc/styleguide/aigis_assets/`,
    ))
    .pipe($.replace('href="/assets/', `href="${contentsPath}assets/`))
    .pipe($.replace('src="/assets/', `src="${contentsPath}assets/`))
    .pipe(gulp.dest(config.paths.styleguide.dist));
  return s;
}

defaultTasks.push(watchDefault);
if (config.settings.apiServer) { // API serverを使う場合、事前にAPIサーバを立てる
  defaultTasks.push(apiServer);
}
defaultTasks.push(server);
exports.default = gulp.series.apply(this, defaultTasks);

exports.build = gulp.series(
  clean,
  // TODO gulp-svg-spritesheet index.js:284 でfs.writeFileでcallbackがないためエラー代替えを探す（あまり使ってないからそのうち）
  // svgSprite,
  gulp.parallel(
    copy,
    views,
    scripts,
    scriptLibs,
    styles,
    images,
    // iconFont, // アイコンフォント作成
    // sharePage, // shareページ生成
  ),
);

if (isWatchDoc === true) {
  documentTasks.push(server);
}
documentTasks.push(cleanDoc);
// documentTasks.push(svgSprite);
documentTasks.push(gulp.parallel(styles, scripts));
documentTasks.push(gulp.parallel(styleGuide, jsDoc));
documentTasks.push(replaceDocument);
if (isWatchDoc === true) {
  documentTasks.push(watchDocument);
}
exports.document = gulp.series.apply(this, documentTasks);

exports.sharePage = sharePage;
exports.lint = gulp.series(lintViews, lintStyles, lintScripts);


// exports.deploy = (callback) => {
//   callback();
// };
//
// exports.test = (callback) => {
//   callback();
// };