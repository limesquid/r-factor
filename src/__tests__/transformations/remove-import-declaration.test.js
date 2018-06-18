const babylon = require('@babel/parser');
const { readTransformationsFile } = require('../test-utils');
const { babylonOptions } = require('../../options');
const removeImportDeclaration = require('../../transformations/remove-import-declaration');

const OUTPUT_PATH = 'remove-import-declaration/output/';

const code = readTransformationsFile('remove-import-declaration/input/common.js');
const ast = babylon.parse(code, babylonOptions);

describe('transformation:remove-import-declaration', () => {
  it('should just sort when module is not found', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'react2',
      global: true,
      namespace: true,
      identifier: true,
      subImports: [ 'PureComponent' ]
    });
    const expectedResult = readTransformationsFile(`${OUTPUT_PATH}/just-sort-when-module-not-found.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should remove default import and leave subImports', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'react',
      identifier: true
    });
    const expectedResult = readTransformationsFile(`${OUTPUT_PATH}/remove-default-retain-sub-imports.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should remove default import and one of subImport', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'react',
      identifier: true,
      subImports: [ 'Fragment' ]
    });
    const expectedResult = readTransformationsFile(`${OUTPUT_PATH}/remove-default-and-one-sub-import.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should remove whole import', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'prop-types',
      identifier: true,
      removeImportIfEmpty: true
    });
    const expectedResult = readTransformationsFile(`${OUTPUT_PATH}/remove-whole-import.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should remove aliased subImport', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'react',
      subImports: [ 'PureComponent' ]
    });
    const expectedResult = readTransformationsFile(`${OUTPUT_PATH}/remove-aliased-sub-import.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should not remove subImport when module is not used', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'react-dom',
      subImports: [ 'xxx' ]
    });
    expect(result).toEqual(code);
  });

  it('should not remove default import when module is not used', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'react-dom',
      identifier: true
    });
    expect(result).toEqual(code);
  });
});
