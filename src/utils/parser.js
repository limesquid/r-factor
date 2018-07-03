const babylon = require('@babel/parser');
const recast = require('recast');
const { babylonOptions } = require('../options');

const parse = (code, options) => recast.parse(code, {
  parser: {
    parse: (source) => babylon.parse(source, { ...babylonOptions, ...options })
  }
});

const print = (ast) => recast.print(ast).code;

const parser = {
  parse,
  print
};

module.exports = parser;
