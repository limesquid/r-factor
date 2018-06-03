const fs = require('fs');
const path = require('path');

const getDataPath = (filepath) => path.resolve(__dirname, 'data', filepath);
const getTransformationsDataPath = (filepath) => path.resolve(__dirname, 'transformations', 'data', filepath);

const readFile = (filepath) => fs.readFileSync(getDataPath(filepath), 'utf-8');
const readTransformationsFile = (filepath) => fs.readFileSync(getTransformationsDataPath(filepath), 'utf-8');

module.exports = {
  readFile,
  readTransformationsFile
};
