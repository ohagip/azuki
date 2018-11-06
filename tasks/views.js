import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();

gulp.task('views', () => {
  const s = gulp
    .src(config.paths.view.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.if(
      config.isWatch && config.settings.view.changed,
      $.changed(config.paths.view.dist, { extension: '.html' }),
    ))
    .pipe($.data((file) => {
      let filePath = path.relative(path.dirname(file.path), file.base);
      filePath = filePath === '' ? './' : `${filePath}/`;
      return { filePath }; // filePath: 相対パス
    }))
    .pipe($.ejs(
      {
        constants: config.constants,
        env: config.env,
      },
      config.settings.ejs.options,
      config.settings.ejs.settings,
    ))
    .pipe($.if(config.settings.view.minify, $.htmlmin(config.settings.minifier)))
    .pipe(gulp.dest(config.paths.view.dist));
  return s;
});
