const {
  isIdentifier,
  isMemberExpression,
  isObjectProperty,
  isObjectPattern,
  isThisExpression,
  isVariableDeclarator
} = require('@babel/types');

const classExtends = (node, name) => classExtendsSomething(node)
  && node.superClass.name === name;

const classExtendsSomething = (node) => Boolean(node.superClass);

const classHasMethod = (...args) => Boolean(getClassMethod(...args));

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

const isDefaultPropsDeclaration = (node) => isMemberDeclaration(node, 'defaultProps');

const isFunctionalComponentDeclaration = (node) => {
  if (!isArrowFunctionDeclaration(node)) {
    return false;
  }

  const declaration = node.declarations[0].init;
  return Boolean(
    (
      declaration.expression === true
      && declaration.body.type === 'JSXElement'
    )
    ||
    (
      declaration.expression === false
      && declaration.body.type === 'BlockStatement'
      && declaration.body.body[declaration.body.body.length - 1].type === 'ReturnStatement'
      && declaration.body.body[declaration.body.body.length - 1].argument.type === 'JSXElement'
    )
  );
};

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

const isStaticDefaultPropsDeclaration = (node) => isStaticPropertyDeclaration(node, 'defaultProps');

const isStaticPropTypesDeclaration = (node) => isStaticPropertyDeclaration(node, 'propTypes');

const isStaticPropertyDeclaration = (node, name) => node.type === 'ClassProperty'
  && node.static
  && node.key.type === 'Identifier'
  && node.key.name === name;

const getObjectExpressionKeys = (node) => node.properties
  .map((property) => property.key.name);

const getNodeIndent = (node) => node.loc.start.column;

const getNodeStartPosition = (node) => node.start;

const getNodeEndPosition = (node) => node.end;

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

const isObjectKeyAccessing = (node, propsVariableName) => isMemberExpression(node)
  && isIdentifier(node.object, { name: propsVariableName });

module.exports = {
  arePropsDestructuredInFunctionalComponentArguments,
  classExtends,
  classHasMethod,
  getClassComponentName,
  getClassMethod,
  getFunctionalComponentName,
  getNodeEndPosition,
  getNodeIndent,
  getNodeStartPosition,
  getObjectExpressionKeys,
  getPropertyNames,
  getReturnStatement,
  getVariableDestructuringPropertyNames,
  getFirstArgumentDestructuredAttributes,
  getFunctionalComponentPropVariableName,
  getFunctionalComponentDefinition,
  isClassDeclaration,
  isComponentDeclaration,
  isDefaultPropsDeclaration,
  isFunctionalComponentDeclaration,
  isMemberDeclaration,
  isMemberOfDeclaration,
  isObjectKeyAccessing,
  isPropertyDestructuring,
  isPropsDeclaration,
  isPropTypesDeclaration,
  isReactImport,
  isStaticDefaultPropsDeclaration,
  isStaticPropTypesDeclaration,
  isStaticPropertyDeclaration,
  isThisPropsDestructuring,
  isThisPropsKeyAccessing,
  isThisPropsMemberExpression
};
