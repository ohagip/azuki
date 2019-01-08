import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();
const runTimestamp = Math.round(Date.now() / 1000);

export default function iconFont() {
  const s = gulp
    .src(config.paths.iconFont.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.iconfont({
      fontName: 'originalFont', // required
      prependUnicode: true, // recommended option
      formats: ['woff', 'ttf'], // default, 'woff2' and 'svg' are available
      descent: 10, // The font descent. It is usefull to fix the font baseline yourself.
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
    .on('glyphs', (glyphs, options) => {
      // CSS templating, e.g.
      console.log(glyphs, options);
    })
    .pipe(gulp.dest(config.paths.iconFont.dist));
  return s;
}