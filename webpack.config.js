const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ENTRY_FILE = path.resolve(__dirname, 'index.js');
const DIST_DIR = path.resolve(__dirname, 'dist');
const BUNDLE_DIST = 'index.js';

const webpackConfig = {
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
    ),
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/@babel-parser/, resource => {
      // if (resource.context.includes('node_modules/draft-js-plugins-editor')) {
        resource.request = '@babel-parser';
      // }
    })
  ]
};

if (process.env.ANALYZE_BUNDLE) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
