const babylon = require('babylon');
const traverse = require('@babel/traverse').default;

const babylonOptions = {
  allowImportExportEverywhere: true,
  sourceType: 'module',
  plugins: [
    'jsx',
    'objectRestSpread',
    'classProperties',
    'functionBind',
    'dynamicImport'
  ]
};

//TODO: reverse code generation https://github.com/estools/escodegen

const canRefactor = (code) => {
  const ast = babylon.parse(code, babylonOptions);
  let hasReactImport = false;

  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      if (isReactImport(node)) {
        console.log(node);
        hasReactImport = true;
      }
    }
  });

  return hasReactImport;
};

const refactor = (code) => {
  const ast = babylon.parse(code, babylonOptions);
  return [
    refactorReactImport
  ].reduce((nextCode, refactoring) => refactoring(nextCode, ast), code);
};

const refactorReactImport = (code, ast) => {
  const importPositions = [];
  const subimports = [ 'Component' ];
  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      if (isReactImport(node)) {
        importPositions.push(node.start, node.end);
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
  subimports.sort();
  return code.substring(0, importPositions[0])
    + `import React, { ${subimports.join(', ')} } from 'react';`
    + code.substring(importPositions[1]);
};

module.exports = { canRefactor, refactor };

const isReactImport = (node) => {
  return node.type === 'ImportDeclaration'
    && node.specifiers[0].type === 'ImportDefaultSpecifier'
    && node.specifiers[0].local.type === 'Identifier'
    && node.specifiers[0].local.name === 'React';
};
