const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const {
  isExportDefaultArrowComponentDeclaration,
  isArrowComponentDeclaration
} = require('../../utils/ast');
const { babylonOptions } = require('../../options');
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

    let isFunctionalComponent = false;

    traverse(ast, {
      ExportDefaultDeclaration({ node }) {
        if (isExportDefaultArrowComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      },
      VariableDeclaration({ node }) {
        if (isArrowComponentDeclaration(node)) {
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
        if (isExportDefaultArrowComponentDeclaration(node)) {
          builder.setNode(node);
        }
      },
      VariableDeclaration({ node }) {
        if (isArrowComponentDeclaration(node)) {
          builder.setNode(node);
        }
      }
    });

    return builder.build();
  }
}

module.exports = ConvertToFunctionComponent;
