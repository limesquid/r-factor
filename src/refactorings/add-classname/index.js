const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const {
  isComponentDeclaration,
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration
} = require('../../utils/ast');
const { babylonOptions } = require('../../options');
const { Refactoring } = require('../../model');
const {
  addImportDeclaration,
  addPropsUsage,
  addPropTypes,
  addRootJsxProps
} = require('../../transformations');
const ComponentBuilder = require('./component-builder');

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
    const ast = babylon.parse(code, babylonOptions);
    let jsxNode = null;

    traverse(ast, {
      JSXElement({ node }) {
        if (!jsxNode) {
          jsxNode = node;
        }
      }
    });

    return Boolean(jsxNode);
  }

  refactorCode(code, ast) {
    const builder = new ComponentBuilder(code);
    let jsxNode = null;

    traverse(ast, {
      JSXElement({ node }) {
        if (!jsxNode) {
          jsxNode = node;
          builder.setNode(node);
        }
      }
    });

    builder.setAst(ast);

    return builder.build();
  }
}

module.exports = AddClassname;
