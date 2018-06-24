const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const {
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration,
  isReactImport
} = require('../../utils/ast');
const { babylonOptions } = require('../../options');
const settings = require('../../settings');
const { Refactoring } = require('../../model');
const ConvertToArrowComponent = require('../convert-to-arrow-component');
const ComponentBuilder = require('./component-builder');

const convertToArrowComponent = new ConvertToArrowComponent();

class ConvertToFunctionComponent extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => {
        if (convertToArrowComponent.canApply(code)) {
          return convertToArrowComponent.refactor(code, ast);
        }
        return code;
      },
      (code, ast) => this.refactorComponent(code, ast)
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);

    if (convertToArrowComponent.canApply(code, ast)) {
      return true;
    }

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

module.exports = ConvertToFunctionComponent;
