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
});
