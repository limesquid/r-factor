const babylon = require('@babel/parser');
const recast = require('recast');
const { babylonOptions } = require('../options');

const parse = (code) => recast.parse(code, {
  parser: {
    parse: (source) => babylon.parse(source, babylonOptions)
  }
});

const print = (ast) => recast.print(ast).code;

const parser = {
  parse,
  print
};

module.exports = parser;
