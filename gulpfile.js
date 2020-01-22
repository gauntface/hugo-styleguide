const gulp = require('gulp');
const path = require('path');
const tsBrowser = require('@hopin/wbt-ts-browser'); 
const css = require('@hopin/wbt-css');
const clean = require('@hopin/wbt-clean');

const themeSrc = path.join(__dirname, 'src');
const themeDst = path.join(__dirname, 'build');
const exampleTheme = path.join(__dirname, 'example', 'themes', 'hopin-styleguide-build');

gulp.task('clean', gulp.series(
  clean.gulpClean({
    src: themeSrc,
    dst: themeDst,
  }),
))

gulp.task('typescript', gulp.series(
  tsBrowser.gulpBuild('hopin.styleguide', {
    src: themeSrc,
    dst: themeDst,
  })
))

gulp.task('css', gulp.series(
  css.gulpBuild({
    src: themeSrc,
    dst: themeDst,
  }, {
    importPaths: [themeSrc],
  }),
))

gulp.task('copy', gulp.series(
  () => {
    return gulp.src(path.join(themeSrc, '**/*.{html,svg,jpg,jpeg,gif}'))
    .pipe(gulp.dest(themeDst));
  }
))

gulp.task('copy-to-example', gulp.series(
  () => {
    return gulp.src(path.join(themeDst, '**/*'))
    .pipe(gulp.dest(exampleTheme));
  }
))

gulp.task('clean-example', gulp.series(
  clean.gulpClean({
    src: exampleTheme,
    dst: exampleTheme,
  }),
))

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'typescript',
    'css',
    'copy',
  ),
  'clean-example',
  'copy-to-example',
))

gulp.task('watch', () => gulp.watch([path.join(themeSrc, '**', '*')], {
  ignoreInitial: false,
}, gulp.series('build')))