const isFunctionalComponentDeclaration = (node) => node.type === 'VariableDeclaration'
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

const isComponentDeclaration = (node) => isClass(node)
  && classExtends(node, 'Component')
  && classHasMethod(node, 'render');

const isPropTypesDeclaration = (node) => node.type === 'ExpressionStatement'
  && node.expression
  && node.expression.type === 'AssignmentExpression'
  && node.expression.left.type === 'MemberExpression'
  && node.expression.left.property.type === 'Identifier'
  && node.expression.left.property.name === 'propTypes';

const isReactImport = (node) => node.type === 'ImportDeclaration'
  && node.specifiers[0].type === 'ImportDefaultSpecifier'
  && node.specifiers[0].local.type === 'Identifier'
  && node.specifiers[0].local.name === 'React';

const isClass = (node) => node.type === 'ClassDeclaration';

const classExtends = (node, name) => node.superClass
  && node.superClass.type === 'Identifier'
  && node.superClass.name === name;

const getClassMethod = (node, name) => node.body
  && node.body.body
  && node.body.body.find(({ type, key }) => type === 'ClassMethod' && key.name === name);

const classHasMethod = (...args) => Boolean(getClassMethod(...args));

const getReturnStatement = (node) => node.body.body.find(({ type }) => type === 'ReturnStatement');

module.exports = {
  isComponentDeclaration,
  isFunctionalComponentDeclaration,
  isPropTypesDeclaration,
  isReactImport,
  isClass,
  classExtends,
  getClassMethod,
  classHasMethod,
  getReturnStatement
};
