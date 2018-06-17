const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const recast = require("recast");
const { babylonOptions } = require('../../options');
const {
  isClassDeclaration,
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration
} = require('../../utils/ast');
const parser = require('../../utils/parser');
const Imports = require('../../utils/imports');
const { Refactoring } = require('../../model');
const ComponentBuilder = require('./component-builder');


class ConnectComponent extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      this.addImports,
      this.connectComponent
    ];
  }

  canApply(code) {
    // const ast = babylon.parse(code, babylonOptions);
    return true;
  }

  connectComponent(code) {
    const ast = parser.parse(code);
    const builder = new ComponentBuilder(code, ast);

    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const { node } = path;
        if (isExportDefaultFunctionalComponentDeclaration(node)) {
          builder.setIsDefaultExport(true);
          builder.setFunctionalComponentPath(path);
          builder.setComponentExportPath(path);
        }
      },
      ExportNamedDeclaration(path) {
        builder.setComponentExportPath(path);
        // builder.setFunctionalComponentPath()
        // builder.setOriginalComponentName()
      },
      VariableDeclaration(path) {
        const { node } = path;
        if (isFunctionalComponentDeclaration(node)) {
          builder.setFunctionalComponentPath(path);
          builder.setOriginalComponentName(node.declarations[0].id.name)
        }
      }
    });

    return builder.build();
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
