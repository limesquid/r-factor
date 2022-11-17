const StringReplacePlugin = require('string-replace-webpack-plugin');
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
      },
      {
        test: /load-rules\.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /fs\.readdirSync\(rulesDir\)\.forEach\(file => {/,
              replacement: () => 'return rules; fs.readdirSync(rulesDir).forEach(file => {'
            }
          ]
        })
      },
      {
        test: /lib\/config\/plugins\.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /plugin = require\(longName\);/,
              replacement: () => 'plugin = require(\'eslint-plugin-react\')'
            }
          ]
        })
      },
      {
        test: /lib\/linter\.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /parser = parserMap\.get\(parserName\) \|\| require\(parserName\);/,
              replacement: () => 'parser = require(\'babel-eslint\');'
            }
          ]
        })
      },
      {
        test: /lib\/config\/config-file\.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /config\.parser = resolver\.resolve\(config\.parser, lookupPath\);/,
              replacement: () => 'config.parser = \'\''
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/@babel-parser/, (resource) => {
      resource.request = '@babel-parser';
    }),
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
  output: {
    ...webpackConfig.output,
    libraryTarget: 'commonjs'
  },
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
