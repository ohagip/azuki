import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();

export default function svgSprite() {
  return gulp
    .src(config.paths.svgSprite.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.svgSprite(config.settings.svgSprite.options))
    .pipe($.replace(
      `"${config.settings.svgSprite.options.mode.css.sprite}"`,
      config.settings.svgSprite.replaceSprite,
    ))
    .pipe(gulp.dest(config.paths.svgSprite.dist));
}