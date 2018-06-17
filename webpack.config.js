const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const ENTRY_FILE = path.resolve(__dirname, 'index.js');
const DIST_DIR = path.resolve(__dirname, 'dist');
const BUNDLE_DIST = 'index.js';

module.exports = {
  mode: 'production',
  target: 'node',
  output: {
    path: DIST_DIR,
    filename: BUNDLE_DIST
  },
  entry: ENTRY_FILE,
  externals: fs.readdirSync('node_modules')
    .filter((directory) => directory !== '.bin')
    .reduce(
      (externals, directory) => Object.assign(externals, {
        [directory]: 'commonjs ' + directory
      }),
      {}
    )
};
