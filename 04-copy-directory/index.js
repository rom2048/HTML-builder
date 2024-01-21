const { copyFile, mkdir, readdir, unlink } = require('fs/promises');
const { resolve } = require('path');

const filesPath = resolve(__dirname, 'files');
const copyPath = resolve(__dirname, 'files-copy');

(async (path) => {
  try {
    await mkdir(copyPath, { recursive: true });
    const oldCopyFiles = await readdir(copyPath);
    oldCopyFiles.map((file) => unlink(resolve(copyPath, file)));
    const dataFilesDir = await readdir(filesPath);
    dataFilesDir.forEach((file) =>
      copyFile(resolve(path, file), resolve(copyPath, file)),
    );
  } catch (error) {
    console.error('Something go wrong:', error.message);
  }
})(filesPath);
