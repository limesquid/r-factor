const parser = require('../../utils/parser');
const traverse = require('@babel/traverse').default;
const {
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration,
  isReactImport
} = require('../../utils/ast');
const { Refactoring } = require('../../model');
const MoveDefaultPropsToClass = require('../move-default-props-to-class');
const MovePropTypesToClass = require('../move-prop-types-to-class');
const ComponentBuilder = require('./component-builder');
const ReactImportBuilder = require('./react-import-builder');

class ConvertToComponent extends Refactoring {
  constructor() {
    super();
    this.moveDefaultPropsToClass = new MoveDefaultPropsToClass();
    this.movePropTypesToClass = new MovePropTypesToClass();
    this.transformations = [
      (code, ast) => this.refactorComponent(code, ast),
      (code, ast) => this.refactorReactImport(code, ast),
      (code) => this.moveDefaultPropsToClass.refactor(code),
      (code) => this.movePropTypesToClass.refactor(code)
    ];
  }

  canApply(code) {
    const ast = parser.parse(code);
    let hasReactImport = false;
    let isFunctionalComponent = false;

    traverse(ast, {
      ExportDefaultDeclaration({ node }) {
        if (isExportDefaultFunctionalComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      },
      ImportDeclaration({ node }) {
        if (isReactImport(node)) {
          hasReactImport = true;
        }
      },
      VariableDeclaration({ node }) {
        if (isFunctionalComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      }
    });

    return hasReactImport || isFunctionalComponent;
  }

  refactorComponent(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      ExportDefaultDeclaration({ node }) {
        if (isExportDefaultFunctionalComponentDeclaration(node)) {
          builder.setNode(node);
        }
      },
      VariableDeclaration({ node }) {
        if (isFunctionalComponentDeclaration(node)) {
          builder.setNode(node);
        }
      }
    });

    return builder.build();
  }

  refactorReactImport(code, ast) {
    const builder = new ReactImportBuilder(code);

    traverse(ast, {
      ImportDeclaration({ node }) {
        if (isReactImport(node)) {
          builder.setNode(node);
        }
      }
    });

    return builder.build();
  }
}

module.exports = ConvertToComponent;
