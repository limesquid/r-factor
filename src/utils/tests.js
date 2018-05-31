const fs = require('fs');
const path = require('path');

const readFile = (filepath) => fs.readFileSync(
  path.resolve(__dirname, '..', '__tests__', 'data', filepath),
  'utf-8'
);

module.exports = {
  readFile
};
