const babylon = require('@babel/parser');
const { readTransformationsFile } = require('../test-utils');
const { babylonOptions } = require('../../options');
const addImportDeclaration = require('../../transformations/add-import-declaration');

const code = readTransformationsFile('add-import-declaration/input/common.js');
const ast = babylon.parse(code, babylonOptions);

describe('transformation:add-import-declaration', () => {
  it('should add sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      subImports: {
        PureComponent: 'PureComponent'
      }
    });
    const expectedResult = readTransformationsFile('add-import-declaration/output/sub-import.js');
    expect(result).toEqual(expectedResult);
  });

  it('should add aliased sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      subImports: {
        PureComponent: 'PurestComponent'
      }
    });
    const expectedResult = readTransformationsFile('add-import-declaration/output/sub-import-alias.js');
    expect(result).toEqual(expectedResult);
  });

  it('should add default import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      identifier: 'Reacto'
    });
    const expectedResult = readTransformationsFile('add-import-declaration/output/default-import.js');
    expect(result).toEqual(expectedResult);
  });

  it('should add new import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'prop-types',
      identifier: 'PropTypes'
    });
    const expectedResult = readTransformationsFile('add-import-declaration/output/new-import.js');
    expect(result).toEqual(expectedResult);
  });

  it('should add new import with sub imports', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'prop-types',
      identifier: 'PropTypes',
      subImports: {
        Something: 'Something'
      }
    });
    const expectedResult = readTransformationsFile('add-import-declaration/output/new-import-with-alias.js');
    expect(result).toEqual(expectedResult);
  });
});
