const gulp = require('gulp');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const spawn = require('child_process').spawn;
const path = require('path');

gulp.task('update-submodules',
  gulp.series(
    async () => {
      const {stdout, stderr} = await exec(`git submodule update --init --remote`);
      console.log(stdout, stderr);
    },
  )
);

gulp.task('build-hopin-base-theme',async () => {
  const {stdout, stderr} = await exec(`npm run build-into-site`, {
    cwd: path.join(__dirname, 'themes-src', 'hopin-base-theme'),
  });
  console.log(stdout, stderr);
});

gulp.task('build', gulp.series(
  'update-submodules',
  'build-hopin-base-theme',
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

gulp.task('server',
  gulp.series(
    gulp.parallel(
      'build',
    ),
    gulp.parallel(
      'hugo-server',
    )
  )
);