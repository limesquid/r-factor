const babylon = require('@babel/parser');
const { readTransformationsFile } = require('../test-utils');
const { babylonOptions } = require('../../options');
const removeImportDeclaration = require('../../transformations/remove-import-declaration');

const OUTPUT_PATH = 'remove-import-declaration/output/';

const code = readTransformationsFile('remove-import-declaration/input/common.js');
const ast = babylon.parse(code, babylonOptions);

describe('transformation:remove-import-declaration', () => {
  it('should do nothing when module is not found', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'react2',
      global: true,
      namespace: true,
      identifier: true,
      subImports: [ 'PureComponent' ]
    });
    expect(result).toEqual(code);
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

  it('should remove whole import when it is invalid', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'prop-types',
      identifier: true
    });
    const expectedResult = readTransformationsFile(`${OUTPUT_PATH}/remove-whole-import.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should remove aliased sub import', () => {
    const result = removeImportDeclaration(code, ast, {
      module: 'react',
      subImports: [ 'PureComponent' ]
    });
    const expectedResult = readTransformationsFile(`${OUTPUT_PATH}/remove-aliased-sub-import.js`);
    expect(result).toEqual(expectedResult);
  });
});
