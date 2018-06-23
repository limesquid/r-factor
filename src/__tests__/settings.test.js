const babylon = require('@babel/parser');
const { readFile } = require('./test-utils');
const { babylonOptions } = require('../options');
const settings = require('../settings');
const addImportDeclaration = require('../transformations/add-import-declaration');
const AddClassname = require('../refactorings/add-classname');

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

  const endOfLines = { windows: '\r\n' };
  Object.keys(endOfLines).forEach((endOfLine) => {
    it(`end-of-line:${endOfLine}`, () => {
      settings.set({ 'end-of-line': endOfLines[endOfLine] });
      const addClassname = new AddClassname();
      const input = readFile(`settings/input/end-of-line-${endOfLine}.js`);
      const output = readFile(`settings/output/end-of-line-${endOfLine}.js`);
      const ast = babylon.parse(input, babylonOptions);
      const result = addClassname.refactor(input, ast);
      expect(result).toEqual(output);
      settings.revert();
    });
  });
});
