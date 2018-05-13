const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const {
  isComponentDeclaration,
  isPropTypesDeclaration,
  isReactImport
} = require('../node-utils');
const { babylonOptions } = require('../options');
const { AbstractRefactoring } = require('../model');
const ComponentBuilder = require('./component-builder');
const ReactImportBuilder = require('./react-import-builder');

class ConvertToFunctionalComponent extends AbstractRefactoring {
  constructor() {
    super();
    this.transformations = [
      this.refactorReactImport,
      this.refactorComponent
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let hasPropTypes = false;
    let hasReactImport = false;
    let isComponent = false;

    traverse(ast, {
      ExpressionStatement({ node }) {
        if (isPropTypesDeclaration(node)) {
          hasPropTypes = true;
        }
      },
      ImportDeclaration({ node }) {
        if (isReactImport(node)) {
          hasReactImport = true;
        }
      },
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          isComponent = true;
        }
      }
    });

    return hasPropTypes && hasReactImport && isComponent;
  }

  refactorComponent(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          builder.setNode(node);
        }
      },
      ExpressionStatement({ node }) {
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

module.exports = ConvertToFunctionalComponent;
