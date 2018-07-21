const parser = require('../../utils/parser');
const traverse = require('@babel/traverse').default;
const { Refactoring } = require('../../model');
const {
  addImportDeclaration,
  addPropsUsage,
  addPropTypes
} = require('../../transformations');
const ComponentBuilder = require('./component-builder');
const ConvertFunctionToArrowComponent = require('../convert-function-to-arrow-component');
const ConvertToFunctionComponent = require('../convert-to-function-component');

const convertFunctionToArrowComponent = new ConvertFunctionToArrowComponent();
const convertToFunctionComponent = new ConvertToFunctionComponent();

class AddClassname extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code, ast) => this.refactorCode(code, ast),
      (code, ast) => addImportDeclaration(code, ast, {
        module: 'prop-types',
        identifier: 'PropTypes'
      }),
      (code, ast) => addPropTypes(code, ast, {
        className: 'PropTypes.string'
      }),
      (code, ast) => addPropsUsage(code, ast, [
        'className'
      ])
    ];
  }

  canApply(code) {
    const ast = parser.parse(code);
    let jsxNode = null;

    traverse(ast, {
      JSXElement(path) {
        jsxNode = path.node;
        path.stop();
      }
    });

    return Boolean(jsxNode);
  }

  getTransformations(initialCode) {
    if (convertFunctionToArrowComponent.canApply(initialCode)) {
      return [
        (code, ast) => convertFunctionToArrowComponent.refactor(code, ast),
        ...this.transformations,
        (code, ast) => convertToFunctionComponent.refactor(code, ast)
      ];
    }
    return this.transformations;
  }

  refactorCode(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      JSXElement(path) {
        builder.setNode(path.node);
        path.stop();
      }
    });

    builder.setAst(ast);

    return builder.build();
  }
}

module.exports = AddClassname;
