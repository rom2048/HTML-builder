const { writeFile, appendFile } = require('fs');
const { resolve } = require('path');
const { stdout, stdin } = require('process');

const filePath = resolve(__dirname, 'text.txt');

writeFile(filePath, '', (e) => {
  if (e) console.log('Error', e.message);
  stdout.write(
    'Hello\nIf you want to close input type exit (on new line) or Ctrl+c\nType Something...\n',
  );
  stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') {
      process.exit();
    }
    appendFile(filePath, data.toString(), (e) => {
      if (e) console.log('Error ', e.message);
    });
  });
  process.on('exit', () => {
    console.log('Bye bye!');
  });
  process.on('SIGINT', () => {
    console.log('Received SIGINT.');
    process.exit();
  });
});
