const babylon = require('@babel/parser');
const { babylonOptions } = require('../../options');
const addImportDeclaration = require('../../transformations/add-import-declaration');

const code = `import React from 'react';
import a, { b, c } from 'a';
import d from 'b';
import e, { f } from 'c';
import { g } from 'd';
`;

describe('utils', () => {
  const ast = babylon.parse(code, babylonOptions);
  const result = addImportDeclaration(code, ast, {
    module: 'react',
    subImports: {
      PureComponent: 'PureComponent'
    }
  });
  console.log(result);
});
