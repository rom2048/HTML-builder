const { readdir, unlink, readFile, appendFile } = require('fs/promises');
const { resolve, extname } = require('path');

const distPath = resolve(__dirname, 'project-dist');
const stylesPath = resolve(__dirname, 'styles');

(async (path) => {
  try {
    const folderData = await readdir(path, { withFileTypes: true });
    folderData.forEach((file) => {
      if (file.isFile() && file.name !== 'index.html') {
        unlink(resolve(path, file.name));
      }
    });
  } catch (error) {
    console.error('Error in dist folder', error.message);
  }
})(distPath);

(async (path) => {
  try {
    const folderData = await readdir(path, { withFileTypes: true });
    folderData.forEach((file) => {
      if (file.isFile() && extname(file.name) === '.css') {
        (async () => {
          try {
            await readFile(resolve(path, file.name)).then((data) =>
              appendFile(resolve(distPath, 'bundle.css'), data.toString()),
            );
          } catch (error) {
            console.error('Error in styles folder', error.message);
          }
        })();
      }
    });
  } catch (error) {
    console.error('Error in styles folder', error.message);
  }
})(stylesPath);
