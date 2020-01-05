const gulp = require('gulp');
const path = require('path');
const tsBrowser = require('@hopin/wbt-ts-browser'); 
const css = require('@hopin/wbt-css'); 

const themeSrc = path.join(__dirname, 'static');

gulp.task('build', gulp.series(
  tsBrowser.gulpBuild('hopin.styleguide', {
    src: path.join(themeSrc, 'ts'),
    dst: path.join(themeSrc, 'js'),
  }),

  // .min.css files, minimized and variables in place
  css.gulpBuild({
    src: path.join(themeSrc, 'css'),
    dst: path.join(themeSrc, 'css'),
  }, {
    importPaths: [path.join(themeSrc, 'css')],
    preserve: false,
  }),
))

gulp.task('watch', () => gulp.watch([path.join(themeSrc, '**', '*')], {
  ignoreInitial: false,
}, gulp.series('build')))