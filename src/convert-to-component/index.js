const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const {
  isFunctionalComponentDeclaration,
  isPropTypesDeclaration,
  isReactImport
} = require('../node-utils');
const { babylonOptions } = require('../options');
const AbstractRefactoring = require('../model/abstract-refactoring');
const ComponentBuilder = require('./component-builder');
const ReactImportBuilder = require('./react-import-builder');

class ConvertToComponent extends AbstractRefactoring {
  constructor() {
    super(getTransformations());
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let hasPropTypes = false;
    let hasReactImport = false;
    let isFunctionalComponent = false;

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
      VariableDeclaration({ node }) {
        if (isFunctionalComponentDeclaration(node)) {
          isFunctionalComponent = true;
        }
      }
    });

    return hasPropTypes && hasReactImport && isFunctionalComponent;
  }
}

const refactorComponent = (code, ast) => {
  const builder = new ComponentBuilder(code);

  traverse(ast, {
    VariableDeclaration({ node }) {
      if (isFunctionalComponentDeclaration(node)) {
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
};

const refactorReactImport = (code, ast) => {
  const builder = new ReactImportBuilder(code);

  traverse(ast, {
    ImportDeclaration({ node }) {
      if (isReactImport(node)) {
        builder.setNode(node);
      }
    }
  });

  return builder.build();
};

const getTransformations = () => [ refactorReactImport, refactorComponent ];

module.exports = ConvertToComponent;
