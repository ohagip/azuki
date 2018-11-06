import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('build', (callback) => {
  runSequence(
    'clean',
    'svgSprite',
    [
      // 'sharePage', // shareページ生成
      'copy',
      'views',
      'scripts:libs',
      'styles',
      'scripts',
      'images',
      // 'iconFont', // アイコンフォント作成
    ],
    callback,
  );
});
