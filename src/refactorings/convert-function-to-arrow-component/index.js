const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const {
  isExportDefaultFunctionComponentDeclaration,
  isFunctionComponentDeclaration
} = require('../../utils/ast');
const { babylonOptions } = require('../../options');
const { Refactoring } = require('../../model');
const ComponentBuilder = require('./component-builder');

class ConvertFunctionToArrowComponent extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorComponent(code, ast)
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let isFunctionalComponent = false;

    traverse(ast, {
      ExportDefaultDeclaration({ node }) {
        if (isExportDefaultFunctionComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      },
      FunctionDeclaration({ node }) {
        if (isFunctionComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      }
    });

    return isFunctionalComponent;
  }

  refactorComponent(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      ExportDefaultDeclaration({ node }) {
        if (isExportDefaultFunctionComponentDeclaration(node)) {
          builder.setNode(node);
        }
      },
      FunctionDeclaration({ node }) {
        if (isFunctionComponentDeclaration(node)) {
          builder.setNode(node);
        }
      }
    });

    return builder.build();
  }
}

module.exports = ConvertFunctionToArrowComponent;
