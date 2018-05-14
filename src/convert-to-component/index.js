const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const {
  isDefaultPropsDeclaration,
  isFunctionalComponentDeclaration,
  isPropTypesDeclaration,
  isReactImport
} = require('../node-utils');
const { babylonOptions } = require('../options');
const { AbstractRefactoring } = require('../model');
const ComponentBuilder = require('./component-builder');
const ReactImportBuilder = require('./react-import-builder');

class ConvertToComponent extends AbstractRefactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorComponent(code, ast),
      (code, ast) => this.refactorReactImport(code, ast)
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let hasDefaultProps = false;
    let hasPropTypes = false;
    let hasReactImport = false;
    let isFunctionalComponent = false;

    traverse(ast, {
      ExpressionStatement({ node }) {
        if (isPropTypesDeclaration(node)) {
          hasPropTypes = true;
        }
        if (isDefaultPropsDeclaration(node)) {
          hasDefaultProps = true;
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

    return hasDefaultProps || hasPropTypes || hasReactImport || isFunctionalComponent;
  }

  refactorComponent(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      VariableDeclaration({ node }) {
        if (isFunctionalComponentDeclaration(node)) {
          builder.setNode(node);
        }
      },
      ExpressionStatement({ node }) {
        if (isDefaultPropsDeclaration(node)) {
          builder.setDefaultPropsNode(node);
        }
        if (isPropTypesDeclaration(node)) {
          builder.setPropTypesNode(node);
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
