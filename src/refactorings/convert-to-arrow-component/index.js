const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { isComponentDeclaration, isReactImport } = require('../../utils/ast');
const { babylonOptions } = require('../../options');
const settings = require('../../settings');
const { Refactoring } = require('../../model');
const ConvertFunctionToArrowComponent = require('../convert-function-to-arrow-component');
const MoveDefaultPropsOutOfClass = require('../move-default-props-out-of-class');
const MovePropTypesOutOfClass = require('../move-prop-types-out-of-class');
const ComponentBuilder = require('./component-builder');
const ReactImportBuilder = require('./react-import-builder');

const convertFunctionToArrowComponent = new ConvertFunctionToArrowComponent();
const moveDefaultPropsOutOfClass = new MoveDefaultPropsOutOfClass();
const movePropTypesOutOfClass = new MovePropTypesOutOfClass();

class ConvertToArrowComponent extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code) => convertFunctionToArrowComponent.refactorIfPossible(code),
      (code) => moveDefaultPropsOutOfClass.refactor(code),
      (code) => movePropTypesOutOfClass.refactor(code),
      (code, ast) => this.refactorReactImport(code, ast),
      (code, ast) => this.refactorComponent(code, ast)
    ];
  }

  canApply(code) {
    if (convertFunctionToArrowComponent.canApply(code)) {
      return true;
    }

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
      || moveDefaultPropsOutOfClass.canApply(code)
      || movePropTypesOutOfClass.canApply(code);
  }

  getSuperClass(code, ast) {
    let superClass = settings.componentSuperclass;

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

module.exports = ConvertToArrowComponent;
