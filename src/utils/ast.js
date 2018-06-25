const { isImportSpecifier } = require('@babel/types');

const classExtendsSomething = (node) => Boolean(node.superClass);

const containsNode = (ast, condition) => {
  if (condition(ast)) {
    return true;
  }

  return Object.keys(ast).reduce(
    (result, key) => {
      if (result) {
        return result;
      }
      const value = ast[key];
      if (Array.isArray(value)) {
        return value.some((node) => containsNode(node, condition));
      }
      if (value && value.type) {
        return containsNode(value, condition);
      }
      return result;
    },
    false
  );
};

const getClassMethod = (node, name) => node.body
  && node.body.body
  && node.body.body.find(({ type, key }) => type === 'ClassMethod' && key.name === name);

const getReturnStatement = (node) => node.body.body.find(({ type }) => type === 'ReturnStatement');

const isFunctionDeclaration = (node) => node.type === 'FunctionDeclaration';

const isArrowFunctionDeclaration = (node) => node.type === 'VariableDeclaration'
  && node.declarations.length === 1
  && node.declarations[0].init.type === 'ArrowFunctionExpression';

const isClassDeclaration = (node) => node.type === 'ClassDeclaration';

const isComponentDeclaration = (node) => isClassDeclaration(node)
  && classExtendsSomething(node);

const isExportDefaultArrowComponentDeclaration = (node) => node.type === 'ExportDefaultDeclaration'
  && node.declaration.type === 'ArrowFunctionExpression'
  && isFunctionalComponentBody(node.declaration);

const isExportDefaultFunctionComponentDeclaration = (node) => node.type === 'ExportDefaultDeclaration'
  && node.declaration.type === 'FunctionDeclaration'
  && isFunctionalComponentBody(node.declaration.body);

const isArrowComponentDeclaration = (node) => {
  if (!isArrowFunctionDeclaration(node)) {
    return false;
  }

  return isFunctionalComponentBody(node.declarations[0].init);
};

const isFunctionComponentDeclaration = (node) => isFunctionDeclaration(node)
  && isFunctionalComponentBody(node.body);

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

module.exports = {
  getClassComponentName,
  getClassMethod,
  getFunctionalComponentName,
  getNodeIndent,
  getReturnStatement,
  getSubImports,
  isArrowComponentDeclaration,
  isClassDeclaration,
  isComponentDeclaration,
  isExportDefaultArrowComponentDeclaration,
  isExportDefaultFunctionComponentDeclaration,
  isFunctionComponentDeclaration,
  isMemberDeclaration,
  isMemberOfDeclaration,
  isPropsDeclaration,
  isPropTypesDeclaration,
  isReactImport,
  isSingleLine,
  isStaticPropertyDeclaration,
  isStaticPropTypesDeclaration
};
