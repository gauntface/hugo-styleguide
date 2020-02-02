const fs = require('fs-extra');
const path = require('path');

async function copyTheme(dstDir) {
  await fs.mkdirp(dstDir);
  await fs.copy(path.join(__dirname, 'build'), dstDir);
}

async function copyContent(dstDir) {
  await fs.mkdirp(dstDir);
  await fs.copy(path.join(__dirname, 'content'), dstDir);
}

module.exports = {
  copyTheme,
  copyContent,
};