const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { babylonOptions } = require('../../options');
const {
  isClassDeclaration,
  isFunctionalComponentDeclaration
} = require('../../utils/ast');
const Imports = require('../../utils/imports');
const { Refactoring } = require('../../model');


class ConnectComponent extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.addImports
    ];
  }

  canApply(code) {
    // const ast = babylon.parse(code, babylonOptions);
    return true;
  }

  generatePropTypes(code, ast) {
    return addPropTypes(code, ast, newPropTypes);
  }

  addImports(code, ast) {
    const imports = new Imports(code, ast);
    const importToAdd = {
      module: 'react-redux',
      subImports: {
        'connect': 'connect'
      }
    };

    return imports.add(importToAdd).sort().build();
  }
}

module.exports = ConnectComponent;
