const gulp = require('gulp');
const path = require('path');
const tsBrowser = require('@hopin/wbt-ts-browser'); 
const css = require('@hopin/wbt-css'); 

gulp.task('build', gulp.series(
  tsBrowser.gulpBuild('hopin.styleguide', {
    src: path.join(__dirname, 'static', 'ts'),
    dst: path.join(__dirname, 'static', 'js'),
  }),

  // .min.css files, minimized and variables in place
  css.gulpBuild({
    src: path.join(__dirname, 'static', 'css'),
    dst: path.join(__dirname, 'static', 'css'),
  }, {
    importPaths: [path.join(__dirname, 'static', 'css')],
    preserve: false,
  }),
))