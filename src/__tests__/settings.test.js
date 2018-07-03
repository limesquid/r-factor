const babylon = require('@babel/parser');
const { readFile } = require('./test-utils');
const { babylonOptions } = require('../options');
const settings = require('../settings');
const addImportDeclaration = require('../transformations/add-import-declaration');
const AddClassname = require('../refactorings/add-classname');

describe('settings', () => {
  const addClassname = new AddClassname();

  [ 'double', 'backtick' ].forEach((quotes) => {
    it(`quotes:add-import-declaration:${quotes}`, () => {
      settings.set({ quotes });
      const input = readFile(`settings/input/quotes-add-import-declaration-${quotes}.js`);
      const output = readFile(`settings/output/quotes-add-import-declaration-${quotes}.js`);
      const ast = babylon.parse(input, babylonOptions);
      const result = addImportDeclaration(input, ast, {
        module: 'react',
        subImports: {
          PureComponent: 'PurestComponent'
        }
      });
      settings.revert();
      expect(result).toEqual(output);
    });
  });

  [ 'backtick' ].forEach((quotes) => {
    it(`quotes:add-classname:${quotes}`, () => {
      settings.set({ quotes });
      const input = readFile(`settings/input/quotes-add-classname-${quotes}.js`);
      const output = readFile(`settings/output/quotes-add-classname-${quotes}.js`);
      const ast = babylon.parse(input, babylonOptions);
      const result = addClassname.refactor(input, ast);
      settings.revert();
      expect(result).toEqual(output);
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
      settings.revert();
      expect(result).toEqual(output);
    });
  });

  [ 'tab' ].forEach((indent) => {
    it(`indent:${indent}`, () => {
      settings.set({ indent });
      const input = readFile(`settings/input/indent-${indent}.js`);
      const output = readFile(`settings/output/indent-${indent}.js`);
      const ast = babylon.parse(input, babylonOptions);
      const result = addClassname.refactor(input, ast);
      settings.revert();
      expect(result).toEqual(output);
    });
  });

  const endOfLines = { windows: '\r\n' };
  Object.keys(endOfLines).forEach((endOfLine) => {
    it(`end-of-line:${endOfLine}`, () => {
      settings.set({ 'end-of-line': endOfLines[endOfLine] });
      const input = readFile(`settings/input/end-of-line-${endOfLine}.js`);
      const output = readFile(`settings/output/end-of-line-${endOfLine}.js`);
      const ast = babylon.parse(input, babylonOptions);
      const result = addClassname.refactor(input, ast);
      settings.revert();
      expect(result).toEqual(output);
    });
  });
});
