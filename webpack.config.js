const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ENTRY_FILE = path.resolve(__dirname, 'index.js');
const DIST_DIR = path.resolve(__dirname, 'dist');
const BUNDLE_DIST = 'index.js';

const webpackConfig = {
  mode: process.env.NODE_ENV,
  target: 'node',
  output: {
    path: DIST_DIR,
    filename: BUNDLE_DIST
  },
  entry: ENTRY_FILE,
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: '4.0.0'
                  }
                }
              ]
            ]
          }
        }
      },
      {
        test: /license\.key.pub$/,
        exclude: /node_modules/,
        use: 'raw-loader'
      }
    ]
  },
  externals: fs.readdirSync('node_modules')
    .filter((directory) => directory !== '.bin')
    .reduce(
      (externals, directory) => Object.assign(externals, {
        [directory]: `commonjs ${directory}`
      }),
      {}
    ),
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/@babel-parser/, (resource) => {
      resource.request = '@babel-parser';
    }),
    new webpack.DefinePlugin({
      'process.env.LICENSE_SECRET': JSON.stringify(process.env.LICENSE_SECRET)
    })
  ]
};

if (process.env.ANALYZE_BUNDLE) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
