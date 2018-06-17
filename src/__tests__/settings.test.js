const babylon = require('@babel/parser');
const { readFile } = require('./test-utils');
const { babylonOptions } = require('../options');
const settings = require('../settings');
const addImportDeclaration = require('../transformations/add-import-declaration');

describe('settings', () => {
  [ 'double', 'backtick' ].forEach((quotes) => {
    it(`quotes:${quotes}`, () => {
      settings.set({ quotes });
      const input = readFile(`settings/input/quotes-${quotes}.js`);
      const output = readFile(`settings/output/quotes-${quotes}.js`);
      const ast = babylon.parse(input, babylonOptions);
      const result = addImportDeclaration(input, ast, {
        module: 'react',
        subImports: {
          PureComponent: 'PurestComponent'
        }
      });
      expect(result).toEqual(output);
      settings.revert();
    });
  });

  [ true, false ].forEach((semicolons) => {
    it(`semicolons:${semicolons}`, () => {
      settings.set({ semicolons });
      const input = readFile(`settings/input/semicolons-${semicolons}.js`);
      const output = readFile(`settings/output/semicolons-${semicolons}.js`);
      const ast = babylon.parse(input, babylonOptions);
      const result = addImportDeclaration(input, ast, {
        module: 'react',
        subImports: {
          PureComponent: 'PurestComponent'
        }
      });
      expect(result).toEqual(output);
      settings.revert();
    });
  });
});