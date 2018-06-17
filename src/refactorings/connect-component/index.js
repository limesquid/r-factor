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
    let functionalComponentName = null;

    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const { node } = path;

        if (functionalComponentName) {
          builder.setIsDefaultExport(true);
          builder.setIsInstantExport(false);
          builder.setComponentExportPath(path);
        }

        if (isExportDefaultFunctionalComponentDeclaration(node)) {
          builder.setIsDefaultExport(true);
          builder.setIsInstantExport(true);
          builder.setComponentExportPath(path);
        }
      },
      ExportNamedDeclaration(path) {
        if (functionalComponentName) {
          builder.setComponentExportPath(path);
          return;
        }
        const variableDeclaration = path.node.declaration;
        if (isFunctionalComponentDeclaration(variableDeclaration)) {
          builder.setIsInstantExport(true);
          builder.setComponentExportPath(path);
          // builder.setFunctionalComponentPath(componentDeclaration);
          // builder.setOriginalComponentName(functionalComponentName);
        }
      },
      VariableDeclaration(path) {
        const { node } = path;
        if (isFunctionalComponentDeclaration(node)) {
          functionalComponentName = node.declarations[0].id.name;
          builder.setFunctionalComponentPath(path);
          builder.setOriginalComponentName(functionalComponentName);
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
