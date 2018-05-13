const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const {
  isReactImport,
  isFunctionalComponent,
  isPropTypesDeclaration
} = require('../node-utils');
const { babelGeneratorOptions, babylonOptions } = require('../options');
const Builder = require('./builder');

const canRefactor = (code) => {
  const ast = babylon.parse(code, babylonOptions);
  let hasReactImport = false;

  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      if (isReactImport(node)) {
        hasReactImport = true;
      }
    }
  });

  return hasReactImport;
};

const refactor = (code) => {
  return [
    refactorReactImport,
    refactorComponent
  ].reduce((nextCode, refactoring) => refactoring(nextCode, babylon.parse(nextCode, babylonOptions)), code);
};

const refactorComponent = (code, ast) => {
  const builder = new Builder(code);

  traverse(ast, {
    VariableDeclaration({ node }) {
      if (isFunctionalComponent(node)) {
        builder.setNode(node);
      }
    }
  });

  traverse(ast, {
    ExpressionStatement({ node }) {
      if (isPropTypesDeclaration(node)) {
        builder.setPropTypesNode(node);
      }
    }
  });

  return builder.build();
};

const refactorReactImport = (code, ast) => {
  const positions = [];
  const subimports = [ 'Component' ];
  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      if (isReactImport(node)) {
        positions.push(node.start, node.end);
        if (node.specifiers.length > 1) {
          subimports.push(...node.specifiers.slice(1).map((specifier) => {
            if (specifier.local.name !== specifier.imported.name) {
              return `${specifier.imported.name} as ${specifier.local.name}`;
            }
            return specifier.local.name || specifier.imported.name;
          }));
        }
      }
    }
  });
  if (positions.length === 0) {
    return code;
  }
  subimports.sort();
  return code.substring(0, positions[0])
    + `import React, { ${subimports.join(', ')} } from 'react';`
    + code.substring(positions[1]);
};

module.exports = { canRefactor, refactor };
