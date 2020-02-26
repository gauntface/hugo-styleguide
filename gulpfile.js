const gulp = require('gulp');
const path = require('path');
const tsBrowser = require('@hopin/wbt-ts-browser'); 
const css = require('@hopin/wbt-css');
const clean = require('@hopin/wbt-clean');
const {promisify} = require('util');
const spawn = require('child_process').spawn;
const fs = require('fs-extra');
const hopinstyleguide = require('./index');

const themeSrc = path.join(__dirname, 'src');
const themeDst = path.join(__dirname, 'build');

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
  css.gulpBuildAll({
    src: themeSrc,
    dst: themeDst,
  }, {
    importPaths: [themeSrc],
  }),
))

gulp.task('copy', gulp.series(
  () => {
    return gulp.src(path.join(themeSrc, '**/*.{toml,json,html,svg,jpg,jpeg,gif}'))
    .pipe(gulp.dest(themeDst));
  }
))

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'typescript',
    'css',
    'copy',
  ),
))

/**
 * The following are tasks are helpful for local dev and testing
 */

gulp.task('copy-styleguide', async () => {
  const themeDir = path.join(__dirname, 'example', 'themes', 'hopin-styleguide')
  const contentDir = path.join(__dirname, 'example', 'content');

  await fs.remove(themeDir);
  await fs.remove(contentDir);

  await hopinstyleguide.copyTheme(themeDir);
  await hopinstyleguide.copyContent(contentDir);
})

let serverInstance;

function startServer() {
  serverInstance = spawn('hugo', ['server', '-D', '--ignoreCache'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, 'example'),
  });
  serverInstance.on('error', (err) => {
    console.error('Failed to run hugo server: ', err);
  });
  serverInstance.addListener('exit', (code) => {
    console.error('Hugo server has exited: ', code);
    setTimeout(startServer, 500);
  });
}

gulp.task('hugo-server',
  gulp.series(startServer)
);

gulp.task('restart-server', async () => {
  if (!serverInstance) {
    return;
  }

  serverInstance.kill();
});

gulp.task('watch-theme', () => {
  const opts = {};
  return gulp.watch([path.join(themeSrc, '**', '*')], opts, gulp.series('build', 'copy-styleguide', 'restart-server'));
});

gulp.task('watch-content', () => {
  const opts = {};
  return gulp.watch([path.join(__dirname, 'content', '**', '*')], opts, gulp.series('copy-styleguide', 'restart-server'));
});

gulp.task('watch',
  gulp.parallel(
    'watch-theme',
    'watch-content',
    gulp.series(
      'build',
      'copy-styleguide',
      'hugo-server',
    ),
  )
);