const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const generateOptions = {
  concise: true,
  retainFunctionParens: true
};

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
  const positions = [];
  let name = '';
  let jsx = '';
  let props = '';
  let body = '';
  let singleReturnStatement = false;
  traverse(ast, {
    VariableDeclaration(path) {
      const { node } = path;
      if (isFunctionalComponent(node)) {
        positions.push(node.start, node.end);
        singleReturnStatement = node.declarations[0].init.body.type === 'JSXElement';
        const jsxBody = singleReturnStatement
          ? node.declarations[0].init.body
          : node.declarations[0].init.body.body[node.declarations[0].init.body.body.length - 1].argument;
        jsx = code.substring(jsxBody.start, jsxBody.end);
        name = node.declarations[0].id.name;

        if (!singleReturnStatement) {
          const bodyNodes = node.declarations[0].init.body.body;
          body = code.substring(bodyNodes[0].start, bodyNodes[bodyNodes.length - 2].end);
        }

        const params = node.declarations[0].init.params;
        if (params.length === 1) {
          if (params[0].type === 'ObjectPattern') {
            props = `const ${generate(params[0], generateOptions).code} = this.props;`
          } else if (params[0].type === 'Identifier') {
            props = `const ${params[0].name} = this.props;`
          }
        }
      }
    }
  });

  if (positions.length === 0) {
    return code;
  }

  let propTypes = '';
  const propTypesPositions = [];
  traverse(ast, {
    ExpressionStatement(path) {
      const { node } = path;
      propTypesPositions.push(node.start, node.end);
      if (isPropTypesDeclaration(node)) {
        propTypes = `static propTypes = ${generate(node.expression.right, { ...generateOptions, concise: false }).code};`
      }
    }
  });

  let oldPropTypes;
  if (propTypesPositions.length > 0) {
    oldPropTypes = code.substring(...propTypesPositions);
  }

  return (code.substring(0, positions[0])
    + `class ${name} extends Component {\n`
    + (propTypes
    ? `  ${propTypes.split('\n')[0]}${propTypes.split('\n').slice(1).map((x) => `\n  ${x}`).join('')}\n\n` : ``)
    + `  render() {\n`
    + (props
    ? `    ${props}\n` : ``)
    + (body
    ? `    ${body}\n\n` : ``)
    + ((props && !body) ? `\n` : ``)
    + `    return (\n`
    + `      ${jsx.split('\n')[0]}${jsx.split('\n').slice(1).map((x) => `\n${singleReturnStatement ? '  ' : ''}  ${x}`).join('')}\n`
    + `    );\n`
    + `  }\n`
    + `}`
    + code.substring(positions[1])).replace(oldPropTypes, '').replace(/\n\n\n/g, '\n');
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

const isReactImport = (node) => {
  return node.type === 'ImportDeclaration'
    && node.specifiers[0].type === 'ImportDefaultSpecifier'
    && node.specifiers[0].local.type === 'Identifier'
    && node.specifiers[0].local.name === 'React';
};

const isFunctionalComponent = (node) => {
  return node.type === 'VariableDeclaration'
    && node.declarations.length === 1
    && node.declarations[0].init.type === 'ArrowFunctionExpression'
    && node.declarations[0].init.generator === false
    && (
      (
        node.declarations[0].init.expression === true
        && node.declarations[0].init.body.type === 'JSXElement'
      )
      ||
      (
        node.declarations[0].init.expression === false
        && node.declarations[0].init.body.type === 'BlockStatement'
        && node.declarations[0].init.body.body[node.declarations[0].init.body.body.length - 1].type === 'ReturnStatement'
        && node.declarations[0].init.body.body[node.declarations[0].init.body.body.length - 1].argument.type === 'JSXElement'
      )
    );
};

const isPropTypesDeclaration = (node) => {
  return node.type === 'ExpressionStatement'
    && node.expression
    && node.expression.type === 'AssignmentExpression'
    && node.expression.left.type === 'MemberExpression'
    && node.expression.left.property.type === 'Identifier'
    && node.expression.left.property.name === 'propTypes';
};
