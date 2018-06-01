const fs = require('fs');
const path = require('path');

const range = (start, end) => [ ...Array(end - start + 1).keys() ].map((index) => start + index);

const readFile = (filepath) => fs.readFileSync(path.resolve(__dirname, 'data', filepath), 'utf-8');

module.exports = {
  range,
  readFile
};
