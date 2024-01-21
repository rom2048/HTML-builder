const { readdir, stat } = require('fs/promises');
const { resolve, extname, basename } = require('path');
const { stdout } = require('process');

const pathDir = resolve(__dirname, 'secret-folder');

(async function (path) {
  try {
    const data = await readdir(path, { withFileTypes: true });
    data.forEach((item) => {
      if (item.isFile()) {
        const ext = extname(path + item.name);
        const name = basename(item.name, ext);
        (async (filePath) => {
          try {
            const size = await stat(filePath).then((res) => res.size);
            stdout.write(`${name} - ${ext} - ${Math.round(size / 1024)}kb\n`);
          } catch (error) {
            console.error('Error in statItem: ', error.message);
          }
        })(path + '/' + item.name);
      }
    });
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})(pathDir);
