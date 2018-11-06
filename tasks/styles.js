import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import autoprefixer from 'autoprefixer';
import cssMqpacker from 'css-mqpacker';
import config from '../config';

const $ = gulpLoadPlugins();
const breakpoints = {};

config.constants.mqBreakpoint.forEach((e) => {
  breakpoints[e.type.toLocaleLowerCase()] = {
    min: e.min,
    max: e.max,
  };
});

config.settings.sass.options.functions = {
  'env()': () => $.sass.compiler.types.String(config.env),
  'constants($key)': (_key) => {
    const key = _key.getValue();
    const value = config.constants[key];

    switch (typeof value) {
      case 'number':
        return $.sass.compiler.types.Number(value);
      case 'boolean':
        return $.sass.compiler.types.Boolean(value);
      default:
        return $.sass.compiler.types.String(value);
    }
  },
  'breakpoint($type, $conditions)': (_type, _conditions) => {
    const type = _type.getValue().toLocaleLowerCase();
    const conditions = _conditions.getValue().toLocaleLowerCase();
    const value = breakpoints[type][conditions];

    switch (typeof value) {
      case 'number':
        return $.sass.compiler.types.Number(value);
      case 'boolean':
        return $.sass.compiler.types.Boolean(value);
      default:
        return $.sass.compiler.types.String(value);
    }
  },
};

gulp.task('styles', () => {
  const s = gulp
    .src(config.paths.style.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.if(
      config.isWatch && config.settings.style.changed,
      $.changed(config.paths.style.dist, { extension: '.css' }),
    ))
    .pipe($.if(config.settings.style.sourcemap, $.sourcemaps.init()))
    .pipe($.sass(config.settings.sass.options))
    .pipe($.postcss([
      autoprefixer(config.settings.autoprefixer),
      cssMqpacker(config.settings.style.cssMqpacker),
    ]))
    .pipe($.if(config.settings.style.minify, $.csso()))
    .pipe($.if(config.settings.style.sourcemap, $.sourcemaps.write('./')))
    .pipe(gulp.dest(config.paths.style.dist));
  return s;
});
