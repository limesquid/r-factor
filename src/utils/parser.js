const babylon = require('@babel/parser');
const recast = require('recast');
const { babylonOptions, getRecastOptions } = require('../options');

const parse = (code, options) => recast.parse(code, {
  ...getRecastOptions(),
  parser: {
    parse: (source) => babylon.parse(source, { ...babylonOptions, ...options })
  }
});

const print = (ast) => recast.print(ast, getRecastOptions()).code;

module.exports = {
  parse,
  print
};
