const acorn = require('acorn');
const walk = require('acorn/dist/walk');
const injectAcornJsx = require('acorn-jsx/inject');
const injectAcornObjectRestSpread = require('acorn-object-rest-spread/inject');

injectAcornJsx(acorn);
injectAcornObjectRestSpread(acorn);

//TODO: reverse code generation https://github.com/estools/escodegen

const acornOptions = {
  sourceType: 'module',
  plugins: {
    jsx: true,
    objectRestSpread: true
  }
};

const canRefactor = (code) => {
  const ast = acorn.parse(code, acornOptions);
  let hasReactImport = false;

  walk.simple(ast, {
    ImportDeclaration(node) {
      if (isReactImport(node)) {
        console.log(node);
        hasReactImport = true;
      }
    }
  });

  return hasReactImport;
};

const refactor = (code) => {
  const ast = acorn.parse(code, acornOptions);
  return [
    refactorReactImport
  ].reduce((nextCode, refactoring) => refactoring(nextCode, ast), code);
};

const refactorReactImport = (code, ast) => {
  const importPositions = [];
  const subimports = [ 'Component' ];
  // console.log(JSON.stringify(ast, null, 2));
  walk.simple(ast, {
    ImportDeclaration(node) {
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
