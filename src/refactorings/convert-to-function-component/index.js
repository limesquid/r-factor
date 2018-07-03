const traverse = require('@babel/traverse').default;
const parser = require('../../utils/parser');
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
      (code, ast) => convertToArrowComponent.refactorIfPossible(code, ast),
      (code, ast) => this.refactorComponent(code, ast)
    ];
  }

  canApply(code) {
    const ast = parser.parse(code);

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
