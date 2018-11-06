import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import config from '../config';
import minimist from 'minimist';

const $ = gulpLoadPlugins();

const argv = minimist(process.argv.slice(2));
const isWatch = argv.watch === 'true';

gulp.task('document', (callback) => {
  if (isWatch === true) {
    runSequence(
      'server',
      'cleanDoc',
      'svgSprite',
      ['styles', 'scripts'],
      ['styleguide', 'jsdoc'],
      ['documentReplace'],
      'documentWatch',
      callback,
    );
  } else {
    runSequence(
      'cleanDoc',
      'svgSprite',
      ['styles', 'scripts'],
      ['styleguide', 'jsdoc'],
      ['documentReplace'],
      callback,
    );
  }
});

gulp.task('documentReplace', () => {
  const contentsPath = config.constants.contentsPath;
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
});

gulp.task('documentWatch', (callback) => {
  config.isWatch = true;
  $.watch(config.paths.style.watch, () => {
    runSequence('styles', 'styleguide', 'server:reload');
  });
  $.watch(config.paths.script.watch, () => {
    runSequence('scripts', 'jsdoc', 'server:reload');
  });
  callback();
});
