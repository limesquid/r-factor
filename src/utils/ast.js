const {
  isIdentifier,
  isImportDefaultSpecifier,
  isImportSpecifier,
  isMemberExpression,
  isObjectProperty,
  isObjectPattern,
  isThisExpression,
  isVariableDeclarator
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

const isClassDeclaration = (node) => node.type === 'ClassDeclaration';

const isComponentDeclaration = (node) => isClassDeclaration(node)
  && classExtendsSomething(node);
  // && classHasMethod(node, 'render'); TODO

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
  node.body.type === 'JSXElement'
  ||
  (
    node.body.type === 'BlockStatement'
    && node.body.body[node.body.body.length - 1].type === 'ReturnStatement'
    && node.body.body[node.body.body.length - 1].argument.type === 'JSXElement'
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

const isReactImport = (node) => node.type === 'ImportDeclaration'
  && node.specifiers[0].type === 'ImportDefaultSpecifier'
  && node.specifiers[0].local.type === 'Identifier'
  && node.specifiers[0].local.name === 'React';

const isSingleLine = (node) => node.loc.end.line === node.loc.start.line;

const isStaticPropTypesDeclaration = (node) => isStaticPropertyDeclaration(node, 'propTypes');

const isStaticPropertyDeclaration = (node, name) => node.type === 'ClassProperty'
  && node.static
  && node.key.type === 'Identifier'
  && node.key.name === name;

const getObjectExpressionKeys = (node) => node.properties
  .map((property) => property.key.name);

const getNodeIndent = (node) => node.loc.start.column;

const getFunctionalComponentName = (node) => node.declarations[0].id.name;

const getClassComponentName = (node) => node.id.name;

const isThisPropsMemberExpression = (node) => isMemberExpression(node)
  && isThisExpression(node.object)
  && isIdentifier(node.property, { name: 'props' });

const isThisPropsDestructuring = (node) => isVariableDeclarator(node)
  && isThisPropsMemberExpression(node.init);

const isPropertyDestructuring = (node, propertyName) => isVariableDeclarator(node)
  && isIdentifier(node.init, { name: propertyName });

const getPropertyNames = (properties) => properties
  .filter(isObjectProperty)
  .map((property) => property.key.name);

const getVariableDestructuringPropertyNames = (node) =>
  getPropertyNames(node.id.properties);

const isThisPropsKeyAccessing = (node) => isMemberExpression(node)
  && isThisPropsMemberExpression(node.object);

const arePropsDestructuredInFunctionalComponentArguments = (componentNode) =>
  isObjectPattern(componentNode.params[0]);

const getFirstArgumentDestructuredAttributes = (node) =>
  getPropertyNames(node.params[0].properties);

const getFunctionalComponentPropVariableName = (componentNode) => componentNode.params.length > 0
  && componentNode.params[0].name;

const getFunctionalComponentDefinition = (node) => node.declarations[0].init;

const getDefaultImportName = (moduleImportNode) => {
  const defaultImportNode = moduleImportNode.specifiers.find(isImportDefaultSpecifier);
  return defaultImportNode && defaultImportNode.local.name;
};

const getSubImports = (moduleImportNode) => moduleImportNode.specifiers
  .filter((specifier) => isImportSpecifier(specifier))
  .reduce((result, specifier) => ({
    ...result,
    [specifier.imported.name]: specifier.local.name
  }), {});

const isObjectKeyAccessing = (node, propsVariableName) => isMemberExpression(node)
  && isIdentifier(node.object, { name: propsVariableName });

module.exports = {
  arePropsDestructuredInFunctionalComponentArguments,
  getClassComponentName,
  getClassMethod,
  getDefaultImportName,
  getFirstArgumentDestructuredAttributes,
  getFunctionalComponentDefinition,
  getFunctionalComponentName,
  getFunctionalComponentPropVariableName,
  getNodeIndent,
  getObjectExpressionKeys,
  getPropertyNames,
  getReturnStatement,
  getSubImports,
  getVariableDestructuringPropertyNames,
  isClassDeclaration,
  isComponentDeclaration,
  isExportDefaultFunctionalComponentDeclaration,
  isFunctionalComponentDeclaration,
  isMemberDeclaration,
  isMemberOfDeclaration,
  isObjectKeyAccessing,
  isPropertyDestructuring,
  isPropsDeclaration,
  isPropTypesDeclaration,
  isReactImport,
  isSingleLine,
  isStaticPropTypesDeclaration,
  isStaticPropertyDeclaration,
  isThisPropsDestructuring,
  isThisPropsKeyAccessing,
  isThisPropsMemberExpression
};
