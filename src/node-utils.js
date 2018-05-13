const isFunctionalComponentDeclaration = (node) => {
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

const isReactImport = (node) => {
  return node.type === 'ImportDeclaration'
    && node.specifiers[0].type === 'ImportDefaultSpecifier'
    && node.specifiers[0].local.type === 'Identifier'
    && node.specifiers[0].local.name === 'React';
};

module.exports = {
  isFunctionalComponentDeclaration,
  isPropTypesDeclaration,
  isReactImport
};
