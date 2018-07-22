const {
  isArrowFunctionExpression,
  isBlockStatement,
  isCallExpression,
  isIdentifier,
  isImportSpecifier,
  isObjectExpression,
  isProgram
} = require('@babel/types');

const classExtendsSomething = (node) => Boolean(node.superClass);

const containsNode = (ast, condition) => {
  if (condition(ast)) {
    return true;
  }

  return Object.keys(ast).some((key) => {
    const value = ast[key];
    if (Array.isArray(value)) {
      return value.some((node) => containsNode(node, condition));
    }
    if (value && value.type) {
      return containsNode(value, condition);
    }
    return false;
  });
};

const getClassMethod = (node, name) => node.body
  && node.body.body
  && node.body.body.find(({ type, key }) => type === 'ClassMethod' && key.name === name);

const getReturnStatement = (node) => node.body.body.find(({ type }) => type === 'ReturnStatement');

const isFunctionDeclaration = (node) => node.type === 'FunctionDeclaration';

const isArrowFunctionDeclaration = (node) => node.type === 'VariableDeclaration'
  && node.declarations.length === 1
  && node.declarations[0].init.type === 'ArrowFunctionExpression';

const isArrowComponentExpression = (node) => isArrowFunctionExpression(node)
  && isFunctionalComponentBody(node.body)
  && !containsNode(node.body, isArrowFunctionExpression)
  && !containsNode(node.body, isFunctionComponentDeclaration);

const isArrowComponentExpressionPath = (path) => {
  let isComponent = false;

  if (!isArrowFunctionExpression(path.node) && !isFunctionDeclaration(path.node)) {
    return false;
  }

  path.traverse({
    enter(innerPath) {
      if (isArrowFunctionExpression(innerPath.node) || isFunctionDeclaration(innerPath.node)) {
        innerPath.skip();
      }
    },
    JSXElement(innerPath) {
      isComponent = true;
      innerPath.stop();
    },
    JSXFragment(innerPath) {
      isComponent = true;
      innerPath.stop();
    }
  });

  return isComponent;
};

const isObjectDeclaration = (node) => node.type === 'VariableDeclaration'
  && node.declarations.length === 1
  && isObjectExpression(node.declarations[0].init);

const isClassDeclaration = (node) => node.type === 'ClassDeclaration';

const isComponentDeclaration = (node) => isClassDeclaration(node)
  && classExtendsSomething(node);

const isExportDefaultArrowComponentDeclaration = (node) => node.type === 'ExportDefaultDeclaration'
  && node.declaration.type === 'ArrowFunctionExpression'
  && isArrowComponentExpression(node.declaration);

const isExportDefaultFunctionComponentDeclaration = (node) => node.type === 'ExportDefaultDeclaration'
  && node.declaration.type === 'FunctionDeclaration'
  && isFunctionalComponentBody(node.declaration.body);

const isArrowComponentDeclaration = (node) => {
  if (!isArrowFunctionDeclaration(node)) {
    return false;
  }
  return isFunctionalComponentBody(node.declarations[0].init);
};

const isArrowComponentDeclarationPath = (path) => {
  if (!isArrowFunctionDeclaration(path.node)) {
    return false;
  }
  return isArrowComponentExpressionPath(path.get('declarations.0.init'));
};

const isFunctionComponentDeclaration = (node) => isFunctionDeclaration(node)
  && isFunctionalComponentBody(node.body)
  && !containsNode(node.body, isArrowComponentExpression)
  && !containsNode(node.body, isFunctionComponentDeclaration);

const isFunctionalComponentBody = (node) => containsNode(
  node,
  ({ type }) => [ 'JSXElement', 'JSXFragment' ].includes(type)
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
    (result, specifier) => [
      ...result,
      {
        name: specifier.imported.name,
        alias: specifier.local.name
      }
    ],
    []
  );

const getFurthestAncestorInScope = (path) => {
  if (isProgram(path.parent) || isBlockStatement(path.parent)) {
    return path;
  }

  return getFurthestAncestorInScope(path.parentPath);
};

const getOutermostCallExpressionPath = (path) => {
  if (!isCallExpression(path.parent)) {
    return path;
  }

  return getOutermostCallExpressionPath(path.parentPath);
};

const isIdentifierInside = (path, identifierName) => {
  let isUsed = false;

  path.traverse({
    Identifier(innerPath) {
      if (innerPath.node.name === identifierName) {
        isUsed = true;
        innerPath.stop();
      }
    }
  });

  return isUsed;
};

module.exports = {
  getClassComponentName,
  getClassMethod,
  getFunctionalComponentName,
  getFurthestAncestorInScope,
  getNodeIndent,
  getOutermostCallExpressionPath,
  getReturnStatement,
  getSubImports,
  isArrowComponentDeclaration,
  isArrowComponentDeclarationPath,
  isArrowComponentExpression,
  isArrowComponentExpressionPath,
  isArrowFunctionDeclaration,
  isClassDeclaration,
  isComponentDeclaration,
  isExportDefaultArrowComponentDeclaration,
  isExportDefaultFunctionComponentDeclaration,
  isFunctionComponentDeclaration,
  isIdentifierInside,
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
