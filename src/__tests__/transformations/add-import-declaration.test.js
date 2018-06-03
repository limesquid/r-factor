const babylon = require('@babel/parser');
const { readFile } = require('../test-utils');
const { babylonOptions } = require('../../options');
const addImportDeclaration = require('../../transformations/add-import-declaration');

const TEST_INPUTS_PATH = '../data/transformations/add-import-declarations/input';
const TEST_OUTPUTS_PATH = '../data/transformations/add-import-declarations/output';

const code = readFile(`${TEST_INPUTS_PATH}/common.js`);
const ast = babylon.parse(code, babylonOptions);

describe('transformation:add-import-declaration', () => {
  it('should add sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      subImports: {
        PureComponent: 'PureComponent'
      }
    });
    const expectedResult = readFile(`${TEST_OUTPUTS_PATH}/sub-import.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should add aliased sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      subImports: {
        PureComponent: 'PurestComponent'
      }
    });
    const expectedResult = readFile(`${TEST_OUTPUTS_PATH}/sub-import-alias.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should add default import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      identifier: 'Reacto'
    });
    const expectedResult = readFile(`${TEST_OUTPUTS_PATH}/default-import.js`);
    expect(result).toEqual(expectedResult);
  });

  it('should add new import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'prop-types',
      identifier: 'PropTypes'
    });
    const expectedResult = readFile(`${TEST_OUTPUTS_PATH}/new-import.js`);
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
    const expectedResult = readFile(`${TEST_OUTPUTS_PATH}/new-import-with-alias.js`);
    expect(result).toEqual(expectedResult);
  });
});
