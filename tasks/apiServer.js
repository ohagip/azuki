import gulp from 'gulp';
import apiServer from '../src/mock/apiServer';

gulp.task('apiServer', (callback) => {
  apiServer(() => {
    callback();
  });
});
