import path from 'path';
import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import config from '../config';

const $ = gulpLoadPlugins();

gulp.task('watch', (callback) => {
  config.isWatch = true;
  const imagesWatcher = $.watch(config.paths.image.watch, () => {
    runSequence('images', 'server:reload');
  });
  const staticWatcher = $.watch(config.paths.static.watch, () => {
    runSequence('copy', 'server:reload');
  });
  $.watch(config.paths.view.watch, () => {
    runSequence('views', 'server:reload');
  });
  $.watch(config.paths.style.watch, () => {
    runSequence('styles', 'server:reload');
  });
  $.watch(config.paths.script.watch, () => {
    runSequence('scripts', 'server:reload');
  });
  $.watch(config.paths.svgSprite.watch, () => {
    runSequence('svgSprite', 'server:reload');
  });
  $.watch(config.paths.iconFont.watch, () => {
    runSequence('iconFont', 'server:reload');
  });

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
});
