const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ENTRY_FILE = path.resolve(__dirname, 'index.js');
const CLI_ENTRY_FILE = path.resolve(__dirname, 'cli.js');
const DIST_DIR = path.resolve(__dirname, 'dist');

const getWebpackConfig = (override) => override({
  mode: process.env.NODE_ENV,
  target: 'node',
  output: {
    path: DIST_DIR
  },
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
});

const libraryWebpackConfig = getWebpackConfig((webpackConfig) => ({
  ...webpackConfig,
  output: {
    ...webpackConfig.output,
    library: 'r-factor',
    libraryTarget: 'umd'
  },
  entry: {
    index: ENTRY_FILE
  }
}));

const cliWebpackConfig = getWebpackConfig((webpackConfig) => ({
  ...webpackConfig,
  entry: {
    cli: CLI_ENTRY_FILE
  }
}));

if (process.env.ANALYZE_BUNDLE) {
  libraryWebpackConfig.plugins.push(new BundleAnalyzerPlugin());
  module.exports = libraryWebpackConfig;
} else {
  module.exports = [
    libraryWebpackConfig,
    cliWebpackConfig
  ];
}
