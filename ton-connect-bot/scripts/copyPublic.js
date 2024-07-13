const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'public');
const destination = path.join(__dirname, '..', 'dist', 'public');

fs.mkdirSync(destination, { recursive: true });

fs.readdirSync(source).forEach(file => {
    const srcFile = path.join(source, file);
    const destFile = path.join(destination, file);
    fs.copyFileSync(srcFile, destFile);
});

console.log('Public files copied to dist/public');
