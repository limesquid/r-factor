const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const {
  isComponentDeclaration,
  isStaticDefaultPropsDeclaration,
  isStaticPropTypesDeclaration,
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
    let hasDefaultProps = false;
    let hasPropTypes = false;
    let hasReactImport = false;
    let isComponent = false;

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          isComponent = true;
        }
      },
      ClassProperty({ node }) {
        if (isStaticPropTypesDeclaration(node)) {
          hasPropTypes = true;
        }
        if (isStaticDefaultPropsDeclaration(node)) {
          hasDefaultProps = true;
        }
      },
      ImportDeclaration({ node }) {
        if (isReactImport(node)) {
          hasReactImport = true;
        }
      }
    });

    return hasDefaultProps || hasPropTypes || hasReactImport || isComponent;
  }

  refactorComponent(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          builder.setNode(node);
        }
      },
      ClassProperty({ node }) {
        if (isStaticPropTypesDeclaration(node)) {
          builder.setPropTypesNode(node);
        }
        if (isStaticDefaultPropsDeclaration(node)) {
          builder.setDefaultPropsNode(node);
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
