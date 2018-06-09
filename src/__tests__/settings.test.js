const babylon = require('@babel/parser');
const { readFile } = require('./test-utils');
const { babylonOptions } = require('../options');
const settings = require('../settings');
const addImportDeclaration = require('../transformations/add-import-declaration');

describe('settings', () => {
  const quotesSettings = [ 'double', 'backtick'];

  quotesSettings.forEach((quotes) => {
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
  })
});
