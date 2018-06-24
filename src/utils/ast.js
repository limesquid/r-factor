const {
  isBlockStatement,
  isIdentifier,
  isImportSpecifier,
  isObjectExpression,
  isProgram
} = require('@babel/types');

const classExtendsSomething = (node) => Boolean(node.superClass);

const getClassMethod = (node, name) => node.body
  && node.body.body
  && node.body.body.find(({ type, key }) => type === 'ClassMethod' && key.name === name);

const getReturnStatement = (node) => node.body.body.find(({ type }) => type === 'ReturnStatement');

const isArrowFunctionDeclaration = (node) => node.type === 'VariableDeclaration'
  && node.declarations.length === 1
  && node.declarations[0].init.type === 'ArrowFunctionExpression'
  && node.declarations[0].init.generator === false;

const isObjectDeclaration = (node) => node.type === 'VariableDeclaration'
  && node.declarations.length === 1
  && isObjectExpression(node.declarations[0].init);

const isClassDeclaration = (node) => node.type === 'ClassDeclaration';

const isComponentDeclaration = (node) => isClassDeclaration(node)
  && classExtendsSomething(node);

const isExportDefaultFunctionalComponentDeclaration = (node) => node.type === 'ExportDefaultDeclaration'
  && node.declaration.type === 'ArrowFunctionExpression'
  && isFunctionalComponentBody(node.declaration);

const isFunctionalComponentDeclaration = (node) => {
  if (!isArrowFunctionDeclaration(node)) {
    return false;
  }

  return isFunctionalComponentBody(node.declarations[0].init);
};

const isFunctionalComponentBody = (node) => Boolean(
  [ 'JSXElement', 'JSXFragment' ].includes(node.body.type)
  ||
  (
    node.body.type === 'BlockStatement'
    && node.body.body[node.body.body.length - 1].type === 'ReturnStatement'
    && [ 'JSXElement', 'JSXFragment' ].includes(node.body.body[node.body.body.length - 1].argument.type)
  )
);

const isMemberOfDeclaration = (node, objectName, name) => isMemberDeclaration(node, name)
  && node.expression.left.object.type === 'Identifier'
  && node.expression.left.object.name === objectName;

const isMemberDeclaration = (node, name) => node.type === 'ExpressionStatement'
  && node.expression
  && node.expression.type === 'AssignmentExpression'
  && node.expression.left.type === 'MemberExpression'
  && node.expression.left.property.type === 'Identifier'
  && node.expression.left.property.name === name;

const isPropsDeclaration = (declaration) => declaration.type === 'VariableDeclarator'
  && declaration.init.type === 'MemberExpression'
  && declaration.init.object.type === 'ThisExpression'
  && declaration.init.property.type === 'Identifier'
  && declaration.init.property.name === 'props';

const isPropTypesDeclaration = (node) => isMemberDeclaration(node, 'propTypes');

const createIsDefaultImport = (name) => (node) => node.type === 'ImportDeclaration'
  && node.specifiers[0].type === 'ImportDefaultSpecifier'
  && node.specifiers[0].local.type === 'Identifier'
  && node.specifiers[0].local.name === name;

const isReactImport = createIsDefaultImport('React');

const isSingleLine = (node) => node.loc.end.line === node.loc.start.line;

const isStaticPropTypesDeclaration = (node) => isStaticPropertyDeclaration(node, 'propTypes');

const isStaticPropertyDeclaration = (node, name) => node.type === 'ClassProperty'
  && node.static
  && node.key.type === 'Identifier'
  && node.key.name === name;

const isUndefinedIdentifier = (node) => isIdentifier(node) && node.name === 'undefined';

const getNodeIndent = (node) => node.loc.start.column;

const getFunctionalComponentName = (node) => node.declarations[0].id.name;

const getClassComponentName = (node) => node.id.name;

const getSubImports = ({ specifiers }) => specifiers
  .filter((specifier) => isImportSpecifier(specifier))
  .reduce(
    (result, specifier) => ({
      ...result,
      [specifier.imported.name]: specifier.local.name
    }),
    {}
  );

const getFurthestAncestorInScope = (path) => {
  if (isProgram(path.parent) || isBlockStatement(path.parent)) {
    return path;
  }

  return getFurthestAncestorInScope(path.parentPath);
}

module.exports = {
  getClassComponentName,
  getClassMethod,
  getFunctionalComponentName,
  getFurthestAncestorInScope,
  getNodeIndent,
  getReturnStatement,
  getSubImports,
  isArrowFunctionDeclaration,
  isClassDeclaration,
  isComponentDeclaration,
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration,
  isMemberDeclaration,
  isMemberOfDeclaration,
  isObjectDeclaration,
  isPropsDeclaration,
  isPropTypesDeclaration,
  isReactImport,
  isSingleLine,
  isStaticPropTypesDeclaration,
  isStaticPropertyDeclaration,
  isUndefinedIdentifier
};
