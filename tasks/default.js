import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('default', (callback) => {
  runSequence(['watch', 'server'], callback);
});
