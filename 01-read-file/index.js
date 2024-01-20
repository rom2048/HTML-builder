const { createReadStream } = require('fs');
const { join } = require('path');

const stream = createReadStream(join(__dirname, 'text.txt'), 'utf-8');

let text = '';

stream.on('data', (chunk) => (text += chunk));
stream.on('end', () => process.stdout.write(text));
stream.on('error', (e) => console.log('Error', e.message));
