const babylon = require('@babel/parser');
const recast = require('recast');
const { babylonOptions } = require('../options');
const settings = require('../settings');

const parse = (code, options) => recast.parse(code, {
  parser: {
    parse: (source) => babylon.parse(source, { ...babylonOptions, ...options })
  }
});

const parseExpression = (code, options) => recast.parse(code, {
  parser: {
    parse: (source) => babylon.parseExpression(source, { ...babylonOptions, ...options })
  }
});

const print = (ast) => recast.print(ast, {
  lineTerminator: settings.endOfLine,
  tabWidth: settings.indent,
  useTabs: settings.indentCharacter === '\t'
}).code;

module.exports = {
  parse,
  parseExpression,
  print
};
