const fs = require('fs');

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');

const version = `${yyyy}.${mm}.${dd}`;

fs.writeFileSync('./src/version.ts', `export const APP_VERSION = '${version}';\n`);
