const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const {
  isClassnamesImport,
  isComponentDeclaration,
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration
} = require('../../utils/ast');
const { babylonOptions } = require('../../options');
const { Refactoring } = require('../../model');
const { addImportDeclaration, addPropsUsage, addPropTypes } = require('../../transformations');
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
    let isComponent = false;
    let isFunctionalComponent = false;

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          isComponent = true;
        }
      },
      ExportDefaultDeclaration({ node }) {
        if (isExportDefaultFunctionalComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      },
      VariableDeclaration({ node }) {
        if (isFunctionalComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      }
    });

    return isComponent || isFunctionalComponent;
  }

  refactorCode(code, ast) {
    const builder = new ComponentBuilder(code);

    traverse(ast, {
      ClassDeclaration({ node }) {
        if (isComponentDeclaration(node)) {
          builder.setNode(node);
        }
      },
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
}

module.exports = AddClassname;
