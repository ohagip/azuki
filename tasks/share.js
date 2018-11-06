import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const sahrePageList = require(`${config.paths.view.dir}_share_page_list`);
const $ = gulpLoadPlugins();

gulp.task('sharePage', (callback) => {
  function create() {
    return new Promise((resolve) => {
      let i = 0;
      const len = sahrePageList.length;
      const template = `${config.paths.view.dir}parts/_shareTemplate.ejs`;
      let count = 0;
      const max = len - 1;
      const dist = `${config.paths.view.dist}share/`;

      del.sync(dist);

      for (; i < len; i += 1) {
        ((idx) => {
          gulp
            .src(template)
            .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
            .pipe($.data(() => {
              const d = {
                // page: page毎設定, CONSTANTS
                page: sahrePageList[idx],
                constants: config.constants,
                env: config.env,
              };
              return d;
            }))
            .pipe($.ejs(config.settings.ejs.options, config.settings.ejs.settings))
            .pipe($.rename({ basename: sahrePageList[idx].id }))
            .pipe(gulp.dest(dist))
            .on('end', () => {
              count += 1;
              if (count === max) {
                resolve();
              }
            });
        })(i);
      }
    });
  }

  const tasks = [create()];

  Promise.all(tasks).then(() => {
    callback();
  });
});
