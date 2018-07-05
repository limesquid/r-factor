const babylon = require('@babel/parser');
const recast = require('recast');
const { babylonOptions } = require('../options');

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

const print = (ast) => recast.print(ast).code;

const parser = {
  parse,
  parseExpression,
  print
};

module.exports = parser;
