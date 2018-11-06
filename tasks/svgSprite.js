import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();

gulp.task('svgSprite', (callback) => {
  if (config.settings.svgSprite.isUse === true) {
    return gulp
      .src(config.paths.svgSprite.src)
      .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
      .pipe($.svgSpritesheet(config.settings.svgSprite.options))
      .pipe(gulp.dest(config.paths.svgSprite.dist));
  }
  return callback();
});
