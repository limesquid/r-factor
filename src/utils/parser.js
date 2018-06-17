const babylon = require('@babel/parser');
const recast = require("recast");
const { babylonOptions } = require('../options');

const parse = (code) => recast.parse(code, {
  parser: {
    parse: (code) => babylon.parse(code, babylonOptions)
  }
});

const print = (ast) => recast.print(ast).code;

const parser = {
  parse,
  print
};

module.exports = parser;
