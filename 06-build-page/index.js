const { resolve, extname } = require('path');
const {
  rm,
  readdir,
  mkdir,
  readFile,
  appendFile,
  copyFile,
  writeFile,
} = require('fs/promises');

const distPath = resolve(__dirname, 'project-dist');
const stylesPath = resolve(__dirname, 'styles');
const componentsPath = resolve(__dirname, 'components');
const assetsPath = resolve(__dirname, 'assets');
const indexPath = resolve(distPath, 'index.html');

(async (path) => {
  try {
    await rm(path, { recursive: true, force: true }).catch((e) =>
      console.error('Can not delete dist:', e.message),
    );
    await mkdir(path, { recursive: true }).catch((e) =>
      console.error('Can not create dist folder:', e.message),
    );
    bundleCss(stylesPath);
    bundleHtml(indexPath);
    copy(assetsPath, resolve(distPath, 'assets'));
  } catch (error) {
    console.error('Can not delete dist:', error.message);
  }
})(distPath);

const bundleCss = async (path) => {
  try {
    (await readdir(path, { withFileTypes: true })).forEach((file) => {
      if (file.isFile() && extname(file.name) === '.css') {
        (async () => {
          try {
            await readFile(resolve(path, file.name)).then(
              async (data) =>
                await appendFile(
                  resolve(distPath, 'style.css'),
                  data.toString(),
                ),
            );
          } catch (error) {
            console.error('Error in styles folder', error.message);
          }
        })();
      }
    });
  } catch (error) {
    console.error('Something go wrong with styles...', error.message);
  }
};

const bundleHtml = async (path) => {
  try {
    await copyFile(resolve(__dirname, 'template.html'), path);
    await readFile(path, 'utf-8').then((data) => {
      const namesTemplate = data.match(/(?<={{)\w+(?=}})/g);
      const templArr = [];
      namesTemplate.forEach(async (name, idx) => {
        const templateData = await readFile(
          resolve(componentsPath, name + '.html'),
          'utf-8',
        );
        templArr.push({ name, templateData });
        if (idx === namesTemplate.length - 1) {
          (async () => {
            await readFile(path, 'utf-8').then(async (d) => {
              let html = d;
              await templArr.forEach((item) => {
                html = html.replace('{{' + item.name + '}}', item.templateData);
              });
              await writeFile(path, html, 'utf-8');
            });
          })();
        }
      });
    });
  } catch (error) {
    console.error('Something go wrong', error.message);
  }
};

const copy = async (pathFrom, pathWhere) => {
  await mkdir(pathWhere, { recursive: true }).catch((e) =>
    console.error('Can not create assets folder', e.message),
  );
  await readdir(pathFrom, { withFileTypes: true }).then((data) => {
    data.forEach(async (item) => {
      if (item.isDirectory()) {
        copy(resolve(pathFrom, item.name), resolve(pathWhere, item.name));
      } else {
        await copyFile(
          resolve(pathFrom, item.name),
          resolve(pathWhere, item.name),
        );
      }
    });
  });
};
