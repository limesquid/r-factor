const parser = require('../../utils/parser');
const settings = require('../../settings');
const { readTransformationsFile } = require('../test-utils');
const addImportDeclaration = require('../../transformations/add-import-declaration');

const code = readTransformationsFile('add-import-declaration/input/common.js');
const ast = parser.parse(code);

describe('transformation:add-import-declaration', () => {
  it('should add sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      subImports: [
        { name: 'PureComponent', alias: 'PureComponent' }
      ]
    });
    const expectedResult = readTransformationsFile('add-import-declaration/output/sub-import.js');
    expect(result).toEqual(expectedResult);
  });

  it('should add sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react-redux',
      subImports: [
        { name: 'a', alias: 'a' }
      ]
    });
    const expectedResult = readTransformationsFile(
      'add-import-declaration/output/sub-import-to-existing-sub-imports.js'
    );
    expect(result).toEqual(expectedResult);
  });

  it('should add aliased sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      subImports: [
        { name: 'PureComponent', alias: 'PurestComponent' }
      ]
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
      subImports: [
        { name: 'Something' }
      ]
    });
    const expectedResult = readTransformationsFile('add-import-declaration/output/new-import-with-alias.js');
    expect(result).toEqual(expectedResult);
  });

  it('should add new import with sub imports (trailing comma)', () => {
    settings.set({ 'trailing-commas': true });
    const trailingCommaCode = readTransformationsFile('add-import-declaration/input/trailing-comma.js');
    const trailingCommaAst = parser.parse(trailingCommaCode);
    const resultWithPropTypes = addImportDeclaration(trailingCommaCode, trailingCommaAst, {
      module: 'prop-types',
      identifier: 'PropTypes',
      subImports: [
        { name: 'Something' }
      ]
    });
    const astWithPropTypes = parser.parse(resultWithPropTypes);
    const resultWithLodash = addImportDeclaration(resultWithPropTypes, astWithPropTypes, {
      module: 'lodash',
      subImports: [
        { name: 'flowRight' }
      ]
    });
    const expectedResult = readTransformationsFile('add-import-declaration/output/trailing-comma.js');
    expect(resultWithLodash).toEqual(expectedResult);
    settings.revert();
  });
});
