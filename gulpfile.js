const gulp = require('gulp');
const path = require('path');
const fs = require('fs-extra');

const hugo = require('@gauntface/hugo-node');
const tsBrowser = require('@hopin/wbt-ts-browser'); 
const css = require('@hopin/wbt-css');
const clean = require('@hopin/wbt-clean');

const hopinstyleguide = require('./index');

const themeSrc = path.join(__dirname, 'src');
const themeDst = path.join(__dirname, 'build');
const copyExts = [
  'toml',
  'json',
  'html',
  'svg',
  'jpg',
  'jpeg',
  'gif',
];

gulp.task('clean', gulp.series(
  clean.gulpClean([themeDst]),
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

gulp.task('copy', () => {
  return gulp.src(path.join(themeSrc, `**/*.{${copyExts.join(',')}}`))
  .pipe(gulp.dest(themeDst));
})

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'typescript',
    'css',
    'copy',
  ),
))

/**
 * The following is used for build the example site
 */

const exampleDir = path.join(__dirname, 'example');
const sgThemeDir = path.join(__dirname, 'example', 'themes', 'hopin-styleguide')
const sgContentDir = path.join(__dirname, 'example', 'content');

function cleanAndRun(themeDir, cp) {
  const fn = async () => {
    await fs.remove(themeDir);
    await cp(themeDir);
  }
  fn.displayName = 'clean-and-run';
  return fn
}

gulp.task('example-sg-theme', cleanAndRun(sgThemeDir, hopinstyleguide.copyTheme))
gulp.task('example-sg-content', cleanAndRun(sgContentDir, hopinstyleguide.copyContent))

gulp.task('example-themes', gulp.series(
  'example-sg-theme',
  'example-sg-content',
));

gulp.task('example-hugo', () => hugo.build(exampleDir, [`--environment=test`]));
gulp.task('example-build', gulp.series(
  'build',
  'example-themes',
  'example-hugo'
))

/**
 * The following is used for running a local server
 */

const hugoServerFlags = ['-D', '--ignoreCache', '--port=1314'];
gulp.task('hugo-server', () => hugo.startServer(exampleDir, hugoServerFlags));
gulp.task('hugo-server-restart', () => hugo.restartServer(exampleDir, hugoServerFlags));

const watchTasks = [
  {task: 'css', glob: path.join(themeSrc, '**', '*.css')},
  {task: 'typescript', glob: path.join(themeSrc, '**', '*.ts')},
  {task: 'copy', glob: path.join(themeSrc, '**', `*.{${copyExts.join(',')}}`)},
  {task: 'example-sg-content', glob: path.join(__dirname, 'content', '**', `*`)},
];
const watchTaskNames = [];
for (const wt of watchTasks) {
  const taskName = `watch-theme-${wt.task}`;
  gulp.task(taskName, () => {
    const opts = {
      ignoreInitial: false,
      delay: 500,
    };
    return gulp.watch(
      [wt.glob],
      opts,
      gulp.series(wt.task, 'example-themes', 'hugo-server-restart'),
    );
  });
  watchTaskNames.push(taskName)
}

gulp.task('watch-theme', gulp.parallel(...watchTaskNames));

gulp.task('watch', gulp.series(
  'build',
  'example-themes',
  gulp.parallel(
    'watch-theme',
    'hugo-server',
  ),
));