const fs = require('fs');
const path = require('path');

const getDataPath = (filepath) => path.resolve(__dirname, 'data', filepath);
const getTransformationsDataPath = (filepath) => path.resolve(__dirname, 'transformations', 'data', filepath);
const getBuildersDataPath = (filepath) => path.resolve(__dirname, 'builders', filepath);
const range = (start, end) => [ ...Array(end - start + 1).keys() ].map((index) => start + index);
const readFile = (filepath) => fs.readFileSync(getDataPath(filepath), 'utf-8');
const readTransformationsFile = (filepath) => fs.readFileSync(getTransformationsDataPath(filepath), 'utf-8');
const readBuilderFile = (filepath) => fs.readFileSync(getBuildersDataPath(filepath), 'utf-8');
const readDirectoryFilenames = (directoryPath) => fs.readdirSync(getDataPath(directoryPath));
const createFileDetails = (file, additionalSettings = {}) => ({
  additionalSettings,
  file
});

module.exports = {
  createFileDetails,
  range,
  readBuilderFile,
  readDirectoryFilenames,
  readFile,
  readTransformationsFile
};
