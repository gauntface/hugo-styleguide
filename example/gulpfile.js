const gulp = require('gulp');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const spawn = require('child_process').spawn;
const clean = require('@hopin/wbt-clean');
const path = require('path');

gulp.task('update-submodules',
  gulp.series(
    async () => {
      const {stdout, stderr} = await exec(`git submodule update --init --remote`);
      console.log(stdout, stderr);
    },
  )
);

gulp.task('clean-themes', gulp.series(
  clean.gulpClean({
    dst: path.join(__dirname, 'themes'),
  }),
))

gulp.task('build-hopin-base-theme',async () => {
  const {stdout, stderr} = await exec(`npm run build-into-site`, {
    cwd: path.join(__dirname, 'themes-src', 'hopin-base-theme'),
  });
  console.log(stdout, stderr);
});

gulp.task('copy-hopin-styleguide-theme', async () => {
  return gulp.src(path.join(__dirname, '..', 'build', '**/*'))
    .pipe(gulp.dest(path.join(__dirname, 'themes', 'hopin-styleguide-build')));
});

gulp.task('build', gulp.series(
  'update-submodules',
  'clean-themes',
  gulp.series(
    'copy-hopin-styleguide-theme',
    'build-hopin-base-theme',
  ),
));

function startServer() {
  const server = spawn('hugo', ['server', '-D', '--ignoreCache'], {
    stdio: 'inherit',
  });
  server.on('error', (err) => {
    console.error('Failed to run hugo server: ', err);
  });
  server.addListener('exit', (code) => {
    console.error('Hugo server has exited: ', code);
    setTimeout(startServer, 5000);
  });
}
gulp.task('hugo-server',
  gulp.series(startServer)
);

gulp.task('watch-hopin-styleguide-theme', () => {
  gulp.watch(
    [path.join(__dirname, '..', 'build', '**', '*')],
    {},
    gulp.series('copy-hopin-styleguide-theme'),
  )
})

gulp.task('server',
  gulp.series(
    gulp.parallel(
      'build',
    ),
    gulp.parallel(
      'watch-hopin-styleguide-theme',
      'hugo-server',
    )
  )
);