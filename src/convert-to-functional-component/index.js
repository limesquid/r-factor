const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { isComponentDeclaration, isReactImport } = require('../node-utils');
const { babylonOptions } = require('../options');
const { AbstractRefactoring } = require('../model');
const MoveDefaultPropsOutOfClass = require('../move-default-props-out-of-class');
const MovePropTypesOutOfClass = require('../move-prop-types-out-of-class');
const ComponentBuilder = require('./component-builder');
const ReactImportBuilder = require('./react-import-builder');

class ConvertToFunctionalComponent extends AbstractRefactoring {
  constructor() {
    super();
    this.moveDefaultPropsOutOfClass = new MoveDefaultPropsOutOfClass();
    this.movePropTypesOutOfClass = new MovePropTypesOutOfClass();
    this.transformations = [
      (code) => this.moveDefaultPropsOutOfClass.refactor(code),
      (code) => this.movePropTypesOutOfClass.refactor(code),
      (code, ast) => this.refactorReactImport(code, ast),
      (code, ast) => this.refactorComponent(code, ast)
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let hasReactImport = false;
    let isComponent = false;

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          isComponent = true;
        }
      },
      ImportDeclaration({ node }) {
        if (isReactImport(node)) {
          hasReactImport = true;
        }
      }
    });

    return hasReactImport
      || isComponent
      || this.moveDefaultPropsToClass.canApply(code)
      || this.movePropTypesToClass.canApply(code);
  }

  getSuperClass(code, ast) {
    let superClass = 'Component';

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          superClass = node.superClass.name;
        }
      }
    });

    return superClass;
  }

  refactorComponent(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
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

    return builder.build(this.getSuperClass(code, ast));
  }
}

module.exports = ConvertToFunctionalComponent;
