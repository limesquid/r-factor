const babylon = require('@babel/parser');
const { babylonOptions } = require('../../options');
const addImportDeclaration = require('../../transformations/add-import-declaration');

const code = 'import React from \'react\';';
const ast = babylon.parse(code, babylonOptions);

describe('utils', () => {
  it('should add sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      subImports: {
        PureComponent: 'PureComponent'
      }
    });
    expect(result).toEqual('import React, { PureComponent } from \'react\';');
  });

  it('should add aliased sub import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      subImports: {
        PureComponent: 'PurestComponent'
      }
    });
    expect(result).toEqual('import React, { PureComponent as PurestComponent } from \'react\';');
  });

  it('should add default import to existing module import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'react',
      identifier: 'Reacto'
    });
    expect(result).toEqual('import Reacto from \'react\';');
  });

  it('should add new import', () => {
    const result = addImportDeclaration(code, ast, {
      module: 'prop-types',
      identifier: 'PropTypes'
    });
    let expectedResult = '';
    expectedResult += 'import PropTypes from \'prop-types\';';
    expectedResult += '\n';
    expectedResult += 'import React from \'react\';';

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
    let expectedResult = '';
    expectedResult += 'import PropTypes, { Something } from \'prop-types\';';
    expectedResult += '\n';
    expectedResult += 'import React from \'react\';';

    expect(result).toEqual(expectedResult);
  });
});
