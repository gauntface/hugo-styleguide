const gulp = require('gulp');
const path = require('path');
const tsBrowser = require('@hopin/wbt-ts-browser'); 

gulp.task('build-template', gulp.series(
  tsBrowser.gulpBuild('hopin.styleguide', {
    src: path.join(__dirname, 'static', 'ts'),
    dst: path.join(__dirname, 'static', 'js'),
  }),
))